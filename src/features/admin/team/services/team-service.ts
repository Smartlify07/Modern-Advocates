import { db } from "@/infrastructure/database/client"
import { teamMembers, teamRole, teamInvites } from "@/infrastructure/database/schema/team"
import { user } from "@/infrastructure/database/schema/auth"
import { auth } from "@/infrastructure/auth/auth"
import { ForbiddenError } from "@/infrastructure/auth/errors"
import { sendTeamInviteEmail } from "@/infrastructure/email/send"
import { eq, like, or, and, sql, desc, count, lt } from "drizzle-orm"
import { headers } from "next/headers"
import crypto from "crypto"

const TEAM_INVITE_TTL_DAYS = 7

const teamRoleToAuthRole: Record<string, string> = {
  Admin: "admin",
  Manager: "manager",
  Editor: "editor",
}

function generateInviteToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString("hex")
  const hash = crypto.createHash("sha256").update(raw).digest("hex")
  return { raw, hash }
}

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex")
}

export interface ListTeamMembersParams {
  search?: string
  role?: string
  page?: number
  pageSize?: number
}

export interface TeamMemberDTO {
  id: string
  name: string | null
  email: string
  role: "Admin" | "Manager" | "Editor"
  status: "Active" | "Pending"
  lastLogin: string | null
}

export interface ListTeamMembersResult {
  members: TeamMemberDTO[]
  total: number
  page: number
  pageSize: number
}

export async function listTeamMembers(
  params: ListTeamMembersParams
): Promise<ListTeamMembersResult> {
  const { search, role, page: rawPage = 1, pageSize = 10 } = params
  const page = Math.max(1, rawPage)
  const offset = (page - 1) * pageSize

  const activeConditions = []
  const pendingConditions = []

  if (search) {
    const q = `%${search.toLowerCase()}%`
    activeConditions.push(
      or(
        like(sql`LOWER(${user.name})`, q),
        like(sql`LOWER(${user.email})`, q),
      )
    )
    pendingConditions.push(like(sql`LOWER(${teamInvites.email})`, q))
  }

  if (role && role !== "all") {
    activeConditions.push(eq(teamMembers.role, role as typeof teamRole.enumValues[number]))
    pendingConditions.push(eq(teamInvites.role, role as typeof teamRole.enumValues[number]))
  }

  const activeWhere = activeConditions.length > 0 ? and(...activeConditions) : undefined
  const pendingWhere = and(
    eq(teamInvites.status, "pending"),
    ...(pendingConditions.length > 0 ? [and(...pendingConditions)] : []),
  )

  const [activeRows, pendingRows, totalActive, totalPending] = await Promise.all([
    db
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        role: teamMembers.role,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      })
      .from(teamMembers)
      .innerJoin(user, eq(teamMembers.userId, user.id))
      .where(activeWhere)
      .orderBy(desc(teamMembers.createdAt)),
    db
      .select({
        id: teamInvites.id,
        role: teamInvites.role,
        email: teamInvites.email,
        createdAt: teamInvites.createdAt,
      })
      .from(teamInvites)
      .where(pendingWhere)
      .orderBy(desc(teamInvites.createdAt)),
    db
      .select({ total: count() })
      .from(teamMembers)
      .innerJoin(user, eq(teamMembers.userId, user.id))
      .where(activeWhere)
      .then((r) => r[0].total),
    db
      .select({ total: count() })
      .from(teamInvites)
      .where(pendingWhere)
      .then((r) => r[0].total),
  ])

  const activeMembers: TeamMemberDTO[] = activeRows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: "Active" as const,
    lastLogin: r.updatedAt?.toISOString() ?? null,
  }))

  const pendingInvites: TeamMemberDTO[] = pendingRows.map((r) => ({
    id: r.id,
    name: null,
    email: r.email,
    role: r.role,
    status: "Pending" as const,
    lastLogin: null,
  }))

  const allMembers = [...activeMembers, ...pendingInvites]
  allMembers.sort((a, b) => {
    const aDate = a.status === "Active" ? (a.lastLogin ?? "") : ""
    const bDate = b.status === "Active" ? (b.lastLogin ?? "") : ""
    return bDate.localeCompare(aDate)
  })

  return {
    members: allMembers.slice(offset, offset + pageSize),
    total: totalActive + totalPending,
    page,
    pageSize,
  }
}

export async function inviteTeamMember(data: {
  email: string
  role: string
  invitedById: string
}) {
  const email = data.email.toLowerCase().trim()

  const existingUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .then((r) => r[0])

  const memberExists = existingUser
    ? await db
        .select({ id: teamMembers.id })
        .from(teamMembers)
        .where(eq(teamMembers.userId, existingUser.id))
        .then((r) => r[0])
    : null

  if (memberExists) {
    throw new Error("User is already an active team member")
  }

  await db
    .update(teamInvites)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(teamInvites.email, email),
        eq(teamInvites.status, "pending"),
        lt(teamInvites.expiresAt, new Date())
      )
    )

  const existingPending = await db
    .select({ id: teamInvites.id })
    .from(teamInvites)
    .where(and(eq(teamInvites.email, email), eq(teamInvites.status, "pending")))
    .then((r) => r[0])

  if (existingPending) {
    throw new Error("An invitation has already been sent to this email")
  }

  const { raw, hash } = generateInviteToken()
  const expiresAt = new Date(Date.now() + TEAM_INVITE_TTL_DAYS * 24 * 60 * 60 * 1000)

  const inviter = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, data.invitedById))
    .then((r) => r[0])

  const [invite] = await db
    .insert(teamInvites)
    .values({
      email,
      role: data.role as typeof teamRole.enumValues[number],
      token: hash,
      invitedById: data.invitedById,
      expiresAt,
    })
    .returning()

  try {
    await sendTeamInviteEmail({
      email,
      token: raw,
      role: data.role,
      inviterName: inviter?.name ?? "An admin",
    })
  } catch {
    await db.delete(teamInvites).where(eq(teamInvites.id, invite.id))
    throw new Error("Failed to send invitation email. Please try again.")
  }

  return {
    id: invite.id,
    email: invite.email,
    role: invite.role,
    status: "Pending" as const,
  }
}

export async function validateInviteToken(rawToken: string) {
  const hash = hashToken(rawToken)

  const invite = await db
    .select()
    .from(teamInvites)
    .where(and(eq(teamInvites.token, hash), eq(teamInvites.status, "pending")))
    .then((r) => r[0])

  if (!invite) {
    return { valid: false as const }
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    await db
      .update(teamInvites)
      .set({ status: "cancelled" })
      .where(eq(teamInvites.id, invite.id))
    return { valid: false as const, expired: true as const }
  }

  const existingUser = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(eq(user.email, invite.email))
    .then((r) => r[0])

  const alreadyMember = existingUser
    ? await db
        .select({ id: teamMembers.id })
        .from(teamMembers)
        .where(eq(teamMembers.userId, existingUser.id))
        .then((r) => r[0])
    : null

  const invitedByUser = invite.invitedById
    ? await db
        .select({ name: user.name, email: user.email })
        .from(user)
        .where(eq(user.id, invite.invitedById))
        .then((r) => r[0])
    : null

  return {
    valid: true as const,
    email: invite.email,
    role: invite.role,
    userExists: !!existingUser,
    alreadyMember: !!alreadyMember,
    userId: existingUser?.id ?? null,
    userName: existingUser?.name ?? null,
    invitedByName: invitedByUser?.name ?? null,
    invitedByEmail: invitedByUser?.email ?? null,
  }
}

export async function acceptInvite(rawToken: string, authenticatedUserId: string) {
  const hash = hashToken(rawToken)

  return await db.transaction(async (tx) => {
    const invite = await tx
      .select()
      .from(teamInvites)
      .where(and(eq(teamInvites.token, hash), eq(teamInvites.status, "pending")))
      .then((r) => r[0])

    if (!invite) {
      throw new Error("Invalid or expired invitation token")
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      await tx
        .update(teamInvites)
        .set({ status: "cancelled" })
        .where(eq(teamInvites.id, invite.id))
      throw new Error("This invitation has expired")
    }

    const existingUser = await tx
      .select({ id: user.id, name: user.name, email: user.email, updatedAt: user.updatedAt })
      .from(user)
      .where(eq(user.id, authenticatedUserId))
      .then((r) => r[0])

    if (!existingUser || existingUser.email !== invite.email) {
      throw new Error("This invitation was sent to a different email address")
    }

    const alreadyMember = await tx
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(eq(teamMembers.userId, existingUser.id))
      .then((r) => r[0])

    if (alreadyMember) {
      await tx
        .update(teamInvites)
        .set({ status: "accepted" })
        .where(eq(teamInvites.id, invite.id))

      return {
        id: alreadyMember.id,
        name: existingUser.name,
        email: existingUser.email,
        role: invite.role,
        status: "Active" as const,
        lastLogin: existingUser.updatedAt?.toISOString() ?? null,
      }
    }

    const [member] = await tx
      .insert(teamMembers)
      .values({
        userId: existingUser.id,
        role: invite.role,
        invitedById: invite.invitedById,
      })
      .returning()

    await tx
      .update(teamInvites)
      .set({ status: "accepted" })
      .where(eq(teamInvites.id, invite.id))

    const memberRole = teamRoleToAuthRole[invite.role] as "admin" | "manager" | "editor" | undefined
    if (memberRole) {
      await tx
        .update(user)
        .set({ role: memberRole })
        .where(eq(user.id, existingUser.id))
    }

    return {
      id: member.id,
      name: existingUser.name,
      email: existingUser.email,
      role: member.role,
      status: "Active" as const,
      lastLogin: existingUser.updatedAt?.toISOString() ?? null,
    }
  })
}

export async function declineInvite(rawToken: string) {
  const hash = hashToken(rawToken)

  const invite = await db
    .select()
    .from(teamInvites)
    .where(and(eq(teamInvites.token, hash), eq(teamInvites.status, "pending")))
    .then((r) => r[0])

  if (!invite) {
    throw new Error("Invalid or expired invitation token")
  }

  await db
    .update(teamInvites)
    .set({ status: "declined" })
    .where(eq(teamInvites.id, invite.id))

  return { success: true }
}

export async function cancelInvite(id: string) {
  return await db.transaction(async (tx) => {
    const invite = await tx
      .select()
      .from(teamInvites)
      .where(and(eq(teamInvites.id, id), eq(teamInvites.status, "pending")))
      .then((r) => r[0])

    if (!invite) {
      throw new Error("Pending invitation not found")
    }

    await tx
      .update(teamInvites)
      .set({ status: "cancelled" })
      .where(eq(teamInvites.id, id))

    return { success: true }
  })
}

export async function updateTeamMemberRole(id: string, role: string) {
  const member = await db
    .select({
      id: teamMembers.id,
      role: teamMembers.role,
      invitedById: teamMembers.invitedById,
      userId: teamMembers.userId,
    })
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .then((r) => r[0])

  if (!member) {
    throw new Error("Team member not found")
  }

  if (!member.invitedById) {
    throw new ForbiddenError("Cannot change the role of the primary admin")
  }

  const [updated] = await db
    .update(teamMembers)
    .set({ role: role as typeof teamRole.enumValues[number] })
    .where(eq(teamMembers.id, id))
    .returning()

  const memberRole = teamRoleToAuthRole[role] as "admin" | "manager" | "editor"
  if (memberRole) {
    await auth.api.setRole({
      body: { userId: member.userId, role: memberRole },
      headers: await headers(),
    })
  }

  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, member.userId))
    .then((r) => r[0])

  return {
    id: updated.id,
    name: userRecord.name,
    email: userRecord.email,
    role: updated.role,
    status: "Active" as const,
    lastLogin: userRecord.updatedAt?.toISOString() ?? null,
  }
}

export async function removeTeamMember(id: string) {
  const member = await db
    .select({ invitedById: teamMembers.invitedById, userId: teamMembers.userId })
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .then((r) => r[0])

  if (!member) {
    throw new Error("Team member not found")
  }

  if (!member.invitedById) {
    throw new ForbiddenError("Cannot remove the primary admin")
  }

  await db.delete(teamMembers).where(eq(teamMembers.id, id))

  await auth.api.setRole({
    body: { userId: member.userId, role: "user" as const },
    headers: await headers(),
  })

  return { success: true }
}