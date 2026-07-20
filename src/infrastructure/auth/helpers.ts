import { headers } from "next/headers"
import { auth } from "./auth"
import { UnauthorizedError, ForbiddenError } from "./errors"
import { isAdminRole } from "./roles"
import type { Statement } from "./permissions"

type PermissionInput = {
  [K in keyof Statement]?: Statement[K][number][]
}

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  if (!isAdminRole(session.user.role)) {
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

export async function requirePermission(
  permissions: PermissionInput,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  const result = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions,
    } as { userId: string; permissions: PermissionInput },
  })

  if ("error" in result && result.error) {
    throw new ForbiddenError("Insufficient permissions")
  }

  return { user: session.user }
}
