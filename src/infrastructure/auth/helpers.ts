import { headers } from "next/headers"
import { auth } from "./auth"
import { UnauthorizedError, ForbiddenError } from "./errors"

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== "admin") {
    throw new ForbiddenError()
  }

  return { user: session.user }
}

export async function requireInstructorOrAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== "admin" && session.user.role !== "instructor") {
    throw new ForbiddenError()
  }

  return { user: session.user }
}

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  return { user: session.user }
}
