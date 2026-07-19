"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { authClient } from "@/infrastructure/auth/client"
import { isAdminRole } from "@/infrastructure/auth/roles"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace("/login")
      return
    }
    router.replace(isAdminRole(session.user.role) ? "/admin" : "/dashboard")
  }, [session, isPending, router])

  return (
    <div className="my-auto flex min-h-0 flex-col items-center justify-center gap-4 justify-self-center">
      <LoaderCircle className="size-8 animate-spin text-ma-admin-primary" />
      <p className="text-2xl font-semibold tracking-tight text-primary">
        Signing you in
      </p>
    </div>
  )
}
