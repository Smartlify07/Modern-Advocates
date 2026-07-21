"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Trophy } from "lucide-react"

import { ProfileDropdown } from "@/features/platform/components/profile-dropdown"
import { ReviewDialog } from "@/features/courses/components/review-dialog"

export default function CoursePlayerNavbar() {
  const params = useParams()
  const courseId = params.courseId as string

  const { data: enrollment } = useQuery({
    queryKey: ["enrollment-progress", courseId],
    queryFn: async () => {
      const r = await fetch(`/api/enrollments/by-course/${courseId}`)
      if (!r.ok) throw new Error(`Failed to fetch enrollment (${r.status})`)
      return r.json() as Promise<{ id: string; progress: number }>
    },
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
      <div className="relative z-20 mx-auto flex items-center justify-between px-4 py-5 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <Link href="/" className="flex w-[157px] flex-col gap-1">
          <Image
            src="/figma-home/logo.svg"
            alt="ModernAdvocates Inc."
            width={58}
            height={44}
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <ReviewDialog />
          <Link
            href="#"
            className="hidden items-center gap-1.5 text-sm text-[#6b7280] hover:text-ma-text md:flex"
          >
            <div className="relative size-[33px]">
              <svg width={size} height={size} className="-rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#E7EBEF"
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
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
