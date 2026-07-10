"use client"

import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/shared/ui/button"
import { authClient } from "@/infrastructure/auth/client"

export function EnrollNowButton({
  courseId,
  variant = "primary",
}: {
  courseId: string
  variant?: "primary" | "outline"
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const enabled = !!session

  const { data: enrollmentCheck, isLoading: checkLoading } = useQuery<{
    enrolled: boolean
  }>({
    queryKey: ["enrollment-check", courseId],
    queryFn: () =>
      fetch(`/api/enrollments/check/${courseId}`).then((r) => {
        if (!r.ok) return { enrolled: false }
        return r.json()
      }),
    enabled,
  })

  const loading = sessionPending || (enabled && checkLoading)
  const isEnrolled = enrollmentCheck?.enrolled ?? false

  let href: string
  let label: string

  if (!session) {
    href = "/signup"
    label = "Enroll Now"
  } else if (isEnrolled) {
    href = `/my-learning/${courseId}`
    label = "Continue Learning"
  } else {
    href = `/checkout?courseId=${courseId}`
    label = "Enroll Now"
  }

  if (loading) {
    return (
      <Button
        disabled
        className="flex h-[53px] w-full items-center justify-center rounded-[60px]"
      >
        <Loader2 className="size-5 animate-spin" />
      </Button>
    )
  }

  if (variant === "outline") {
    return (
      <div className="group relative">
        <Button asChild className="w-full rounded-[60px]" variant="outline">
          <Link
            href={href}
            className="flex h-[53px] w-full items-center justify-center gap-2.5 rounded-[60px] border border-[#e5e7eb] bg-white px-5 py-4 text-base font-semibold text-primary transition-colors duration-300 group-hover:border-transparent group-hover:bg-transparent"
          >
            {label}
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Button asChild className="group relative overflow-hidden rounded-[60px]">
      <Link
        href={href}
        className="flex h-[53px] w-full items-center justify-center gap-2.5 rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white"
      >
        <span className="relative z-10 inline-flex items-center gap-2.5">
          {label}
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
        </span>
        <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
    </Button>
  )
}
