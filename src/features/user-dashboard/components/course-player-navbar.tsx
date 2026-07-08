"use client"

import Link from "next/link"
import Image from "next/image"
import { Trophy } from "lucide-react"

import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { authClient } from "@/infrastructure/auth/client"

export default function CoursePlayerNavbar() {
  const { data: session } = authClient.useSession()
  const user = session?.user
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() ?? "U"

  const progress = 65
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
          <Link
            href="#"
            className="hidden bg-[#E7EBEF] px-3 py-1.5 text-sm text-[#448AFF] md:block"
          >
            Leave review
          </Link>
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
          <Avatar className="size-8 bg-primary text-white">
            <AvatarFallback className="bg-primary font-extrabold text-primary-foreground">
              {firstLetter}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
