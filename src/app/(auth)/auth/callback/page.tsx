"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { authClient } from "@/infrastructure/auth/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending || !session) return
    router.push(session.user.role === "admin" ? "/admin" : "/dashboard")
  }, [session, isPending, router])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-40">
      <LoaderCircle className="size-8 animate-spin text-ma-admin-primary" />
      <p className="text-2xl font-semibold text-primary">Signing you in...</p>
    </div>
  )
}
