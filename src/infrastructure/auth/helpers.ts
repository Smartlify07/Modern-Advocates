import { headers } from "next/headers"
import { auth } from "./auth"

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "admin") {
    throw new Error("Forbidden")
  }

  return { user: session.user }
}

export async function requireInstructorOrAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "admin" && session.user.role !== "instructor") {
    throw new Error("Forbidden")
  }

  return { user: session.user }
}

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  return { user: session.user }
}
