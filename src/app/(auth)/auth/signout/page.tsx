"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { authClient } from "@/infrastructure/auth/client"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      try {
        await authClient.signOut()
      } finally {
        router.push("/login")
      }
    }
    signOut()
  }, [router])

  return (
    <div className="my-auto flex flex-col items-center justify-center gap-4 justify-self-center-safe">
      <LoaderCircle className="size-8 animate-spin text-ma-admin-primary" />
      <p className="text-2xl font-semibold tracking-tight text-primary">
        Logging out
      </p>
    </div>
  )
}
