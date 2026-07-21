"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, LoaderCircle } from "lucide-react"

import { Button } from "@/shared/ui/button"
import type { Donation } from "@/features/admin/donations/types"

export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided")
      setLoading(false)
      return
    }

    fetch(`/api/donations/success?session_id=${sessionId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error ?? "Failed to verify donation")
        }
        return res.json()
      })
      .then((data) => {
        setDonation(data.donation)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [sessionId])

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-ma-text" />
          <p className="text-lg text-ma-text">Verifying your donation...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg text-red-600">{error}</p>
          <Button asChild>
            <Link href="/donation">Try Again</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <CheckCircle className="size-16 text-green-500" />
        <h1 className="text-4xl font-extrabold tracking-[-5%] text-ma-text">
          Thank you, {donation?.donorName}!
        </h1>
        <p className="max-w-md text-lg text-[#6b7280]">
          Your donation of{" "}
          <span className="font-semibold text-ma-text">
            ${Number(donation?.amount ?? 0).toFixed(2)} USD
          </span>{" "}
          has been received. Your support helps us make a real impact.
        </p>
        <p className="text-sm text-[#6b7280]">
          A receipt will be sent to {donation?.donorEmail}.
        </p>
          <Link href="/">
            <Button className="group relative h-13 w-40 overflow-hidden rounded-[60px] bg-ma-text text-base font-semibold text-white">
              <span className="relative z-10">Back to Home</span>
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>
          </Link>
      </div>
    </main>
  )
}
