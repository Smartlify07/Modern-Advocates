"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { authClient } from "@/infrastructure/auth/client"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      await authClient.signOut()
      router.push("/login")
    }
    signOut()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-40">
      <LoaderCircle className="size-8 animate-spin text-ma-admin-primary" />
      <p className="text-2xl font-semibold text-primary">Logging out...</p>
    </div>
  )
}
