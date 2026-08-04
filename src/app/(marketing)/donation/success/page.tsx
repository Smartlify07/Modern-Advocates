"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, LoaderCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/shared/ui/button"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import type { Donation } from "@/features/admin/donations/types"

function DonationSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const { data, isLoading, error } = useQuery<{ donation: Donation }>({
    queryKey: queryKeys.donationSuccess(sessionId),
    queryFn: () =>
      apiFetch<{ donation: Donation }>(`/api/donations/success?session_id=${sessionId}`),
    enabled: !!sessionId,
  })

  const donation = data?.donation ?? null

  if (isLoading) {
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
          <p className="text-lg text-red-600">{error.message ?? "No session ID provided"}</p>
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
        <h1 className="text-4xl font-extrabold tracking-tight-xl text-ma-text">
          Thank you, {donation?.donorName}!
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Your donation of{" "}
          <span className="font-semibold text-ma-text">
            ${Number(donation?.amount ?? 0).toFixed(2)} USD
          </span>{" "}
          has been received. Your support helps us make a real impact.
        </p>
          <Link href="/">
            <Button className="group relative h-13 w-40 overflow-hidden rounded-pill bg-ma-text text-base font-semibold text-white">
              <span className="relative z-10">Back to Home</span>
              <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>
          </Link>
      </div>
    </main>
  )
}

export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="size-8 animate-spin text-ma-text" />
            <p className="text-lg text-ma-text">Verifying your donation...</p>
          </div>
        </main>
      }
    >
      <DonationSuccessContent />
    </Suspense>
  )
}
