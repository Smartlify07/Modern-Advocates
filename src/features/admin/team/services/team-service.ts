import { db } from "@/infrastructure/database/client"
import { teamMembers, teamRole } from "@/infrastructure/database/schema/team"
import { user } from "@/infrastructure/database/schema/auth"
import { auth } from "@/infrastructure/auth/auth"
import { ForbiddenError } from "@/infrastructure/auth/errors"
import { eq, like, or, and, sql, desc, count } from "drizzle-orm"
import { headers } from "next/headers"

const teamRoleToAuthRole: Record<string, string> = {
  Admin: "admin",
  Manager: "manager",
  Editor: "editor",
}

export interface ListTeamMembersParams {
  search?: string
  role?: string
  page?: number
  pageSize?: number
}

export interface TeamMemberDTO {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Editor"
  status: "Active"
  lastLogin: string
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

  const conditions = []

  if (search) {
    const q = `%${search.toLowerCase()}%`
    conditions.push(
      or(
        like(sql`LOWER(${user.name})`, q),
        like(sql`LOWER(${user.email})`, q),
      )
    )
  }

  if (role && role !== "all") {
    conditions.push(eq(teamMembers.role, role as typeof teamRole.enumValues[number]))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        role: teamMembers.role,
        name: user.name,
        email: user.email,
        banned: user.banned,
        updatedAt: user.updatedAt,
      })
      .from(teamMembers)
      .innerJoin(user, eq(teamMembers.userId, user.id))
      .where(where)
      .orderBy(desc(teamMembers.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ total: count() })
      .from(teamMembers)
      .innerJoin(user, eq(teamMembers.userId, user.id))
      .where(where)
      .then((r) => r[0].total),
  ])

  return {
    members: rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      status: "Active" as const,
      lastLogin: r.updatedAt?.toISOString() ?? new Date().toISOString(),
    })),
    total: totalResult,
    page,
    pageSize,
  }
}

export async function addTeamMember(data: {
  email: string
  role: string
  invitedById: string
}) {
  const userRecord = await db
    .select({ id: user.id, name: user.name, email: user.email, updatedAt: user.updatedAt })
    .from(user)
    .where(eq(user.email, data.email.toLowerCase().trim()))
    .then((r) => r[0])

  if (!userRecord) {
    throw new Error("No user found with that email address")
  }

  const existing = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userRecord.id))
    .then((r) => r[0])

  if (existing) {
    throw new Error("User is already a team member")
  }

  const [member] = await db
    .insert(teamMembers)
    .values({
      userId: userRecord.id,
      role: data.role as typeof teamRole.enumValues[number],
      invitedById: data.invitedById,
    })
    .returning()

  const memberRole = teamRoleToAuthRole[data.role] as "admin" | "manager" | "editor"
  if (memberRole) {
    await auth.api.setRole({
      body: { userId: userRecord.id, role: memberRole },
      headers: await headers(),
    })
  }

  return {
    id: member.id,
    name: userRecord.name,
    email: userRecord.email,
    role: member.role,
    status: "Active" as const,
    lastLogin: userRecord.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
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
    lastLogin: userRecord.updatedAt?.toISOString() ?? new Date().toISOString(),
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
