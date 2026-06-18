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
