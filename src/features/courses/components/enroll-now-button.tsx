"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { authClient } from "@/infrastructure/auth/client"

export function EnrollNowButton({
  courseId,
  variant = "primary",
}: {
  courseId: string
  variant?: "primary" | "outline"
}) {
  const { data: session } = authClient.useSession()
  const href = session ? `/checkout?courseId=${courseId}` : "/signup"

  if (variant === "outline") {
    return (
      <div className="group relative">
        <Button asChild className="w-full rounded-[60px]" variant="outline">
          <Link
            href={href}
            className="flex h-[53px] w-full items-center justify-center gap-2.5 rounded-[60px] border border-[#e5e7eb] bg-white px-5 py-4 text-base font-semibold text-primary transition-colors duration-300 group-hover:border-transparent group-hover:bg-transparent"
          >
            Enroll Now
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
          Enroll Now
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
        </span>
        <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
    </Button>
  )
}
