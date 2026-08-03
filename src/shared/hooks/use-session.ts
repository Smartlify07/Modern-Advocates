"use client"

import { authClient } from "@/infrastructure/auth/client"

export function useSession() {
  const session = authClient.useSession()

  return {
    ...session,
    user: session.data?.user,
    role: session.data?.user?.role,
  }
}
