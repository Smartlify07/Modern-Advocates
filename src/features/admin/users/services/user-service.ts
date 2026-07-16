import { db } from "@/infrastructure/database/client"
import { enrollments } from "@/infrastructure/database/schema/course"
import { auth } from "@/infrastructure/auth/auth"
import { count, eq, inArray } from "drizzle-orm"
import { headers } from "next/headers"

export interface ListUsersParams {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface UserListItem {
  id: string
  name: string
  email: string
  courseEnrolled: number
  status: "active" | "suspended"
  lastLogin: string
  createdAt: string
}

export interface ListUsersResult {
  users: UserListItem[]
  total: number
  page: number
  pageSize: number
}

export async function listUsers(
  params: ListUsersParams
): Promise<ListUsersResult> {
  const { search, status, page = 1, pageSize = 10 } = params
  const offset = (page - 1) * pageSize

  const query: Record<string, unknown> = {
    limit: pageSize,
    offset,
    sortBy: "createdAt",
    sortDirection: "desc",
  }

  if (search) {
    query.searchValue = search
    query.searchField = "name"
    query.searchOperator = "contains"
  }

  if (status === "active") {
    query.filterField = "banned"
    query.filterValue = false
    query.filterOperator = "eq"
  } else if (status === "suspended") {
    query.filterField = "banned"
    query.filterValue = true
    query.filterOperator = "eq"
  }

  const result = await auth.api.listUsers({
    query: query as never,
    headers: await headers(),
  })

  const apiUsers = result.users as Array<{
    id: string
    name: string
    email: string
    banned: boolean
    createdAt: Date
    updatedAt: Date
  }>

  const userIds = apiUsers.map((u) => u.id)
  let enrollmentCounts: Record<string, number> = {}

  if (userIds.length > 0) {
    const counts = await db
      .select({
        userId: enrollments.studentId,
        count: count(enrollments.id),
      })
      .from(enrollments)
      .where(inArray(enrollments.studentId, userIds))
      .groupBy(enrollments.studentId)

    enrollmentCounts = Object.fromEntries(
      counts.map((c) => [c.userId, Number(c.count)])
    )
  }

  return {
    users: apiUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      courseEnrolled: enrollmentCounts[u.id] ?? 0,
      status: u.banned ? ("suspended" as const) : ("active" as const),
      lastLogin: u.updatedAt?.toISOString() ?? u.createdAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
    })),
    total: result.total ?? 0,
    page,
    pageSize,
  }
}

export async function createUser(data: { name: string; email: string }) {
  return auth.api.createUser({
    body: {
      email: data.email,
      name: data.name,
      password: crypto.randomUUID(),
      role: "user",
    },
    headers: await headers(),
  })
}

export async function suspendUser(userId: string) {
  return auth.api.banUser({
    body: { userId },
    headers: await headers(),
  })
}

export async function activateUser(userId: string) {
  return auth.api.unbanUser({
    body: { userId },
    headers: await headers(),
  })
}

export async function deleteUser(userId: string) {
  return auth.api.removeUser({
    body: { userId },
    headers: await headers(),
  })
}
