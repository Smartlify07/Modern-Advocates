"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Menu, Trophy, X } from "lucide-react"

import { ProfileDropdown } from "@/features/platform/components/profile-dropdown"
import { ReviewDialog } from "@/features/courses/components/review-dialog"
import { apiFetch } from "@/shared/lib/api-fetch"

export default function CoursePlayerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const params = useParams()
  const courseId = params.courseId as string

  const { data: enrollment } = useQuery({
    queryKey: ["enrollment-progress", courseId],
    queryFn: () =>
      apiFetch<{ id: string; progress: number }>(`/api/enrollments/by-course/${courseId}`),
    enabled: !!courseId,
  })

  const progress = enrollment?.progress ?? 0
  const size = 33
  const strokeWidth = 2.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <header className="bg-white">
      <div className="relative z-20 mx-auto px-4 py-5 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <ProfileDropdown
              className="size-10"
              dropdownWidth="min-w-0 w-72"
              alignOffset={8}
              sideOffset={12}
            />
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="bg-muted px-3 py-1.5 text-sm text-ma-info md:hidden"
            >
              Leave review
            </button>
          </div>
          <Link href="/dashboard" className="hidden w-[157px] flex-col gap-1 md:flex">
            <Image
              src="/figma-home/logo.svg"
              alt="ModernAdvocates Inc."
              width={58}
              height={44}
              priority
            />
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="hidden bg-muted px-3 py-1.5 text-sm text-ma-info md:block"
            >
              Leave review
            </button>
            <Link
              href="#"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ma-text"
            >
              <div className="relative size-[33px]">
                <svg width={size} height={size} className="-rotate-90">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--ma-primary-text)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <Trophy className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              Your progress
            </Link>
            <ProfileDropdown className="size-10" />
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="size-10 rounded-[12px] border p-2 md:hidden"
          >
            {mobileOpen ? (
              <X className="size-6 text-muted-foreground" />
            ) : (
              <Menu className="size-6 text-muted-foreground" />
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${mobileOpen ? "mt-4 max-h-100 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 border-t border-gray-100 pt-4"
          >
            <Link
              href="#"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 rounded-lg p-3 text-base text-muted-foreground transition-all duration-300 hover:text-ma-text"
            >
              <div className="relative size-[33px]">
                <svg width={size} height={size} className="-rotate-90">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--ma-primary-text)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <Trophy className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              Your progress
            </Link>
          </nav>
        </div>

        <ReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} />
      </div>
    </header>
  )
}
