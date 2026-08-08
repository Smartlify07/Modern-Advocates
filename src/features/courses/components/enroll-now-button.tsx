"use client"

import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/shared/ui/button"
import { apiFetch } from "@/shared/lib/api-fetch"
import { useSession } from "@/shared/hooks/use-session"
import { queryKeys } from "@/shared/lib/query-keys"

export function EnrollNowButton({
  courseId,
  variant = "primary",
}: {
  courseId: string
  variant?: "primary" | "outline"
}) {
  const { data: session, isPending: sessionPending } = useSession()
  const enabled = !!session

  const { data: enrollmentCheck, isLoading: checkLoading } = useQuery<{
    enrolled: boolean
  }>({
    queryKey: queryKeys.enrollment.check(courseId),
    queryFn: async () => {
      try {
        return await apiFetch<{ enrolled: boolean }>(
          `/api/enrollments/check/${courseId}`
        )
      } catch {
        return { enrolled: false }
      }
    },
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
        className="flex h-pill w-full items-center justify-center rounded-pill"
      >
        <Loader2 className="size-5 animate-spin" />
      </Button>
    )
  }

  if (variant === "outline") {
    return (
      <div className="group relative">
        <Button asChild className="w-full rounded-pill" variant="outline">
          <Link
            href={href}
            className="flex h-pill w-full items-center justify-center gap-2.5 rounded-pill border border-border bg-white px-5 py-4 text-base font-semibold text-primary transition-colors duration-300 group-hover:border-transparent group-hover:bg-transparent"
          >
            {label}
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Button asChild className="group relative overflow-hidden rounded-pill">
      <Link
        href={href}
        className="flex h-pill w-full items-center justify-center gap-2.5 rounded-pill bg-ma-admin-primary px-5 py-4 text-base font-semibold text-white"
      >
        <span className="relative z-10 inline-flex items-center gap-2.5">
          {label}
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
        </span>
        <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
    </Button>
  )
}
