"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"

import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"

export default function CoursePlayerNavbar() {
  return (
    <header className="bg-white">
      <div className="relative z-20 mx-auto flex items-center justify-between px-4 py-5 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <Link href="/" className="flex w-[157px] flex-col gap-1">
          <Image src="/figma-home/logo.svg" alt="ModernAdvocates Inc." width={58} height={44} priority />
        </Link>

        <Badge variant="secondary" className="hidden rounded-full px-4 py-1 text-sm font-medium md:inline-flex">
          Learning
        </Badge>

        <div className="flex items-center gap-4">
          <Link href="#" className="hidden text-sm text-[#6b7280] hover:text-ma-text md:block">
            Leave review
          </Link>
          <Link href="#" className="hidden text-sm text-[#6b7280] hover:text-ma-text md:block">
            Your progress
          </Link>
          <Bell className="size-5 text-[#6B7280]" />
          <Avatar className="size-8 bg-primary text-white">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">PU</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
