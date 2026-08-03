"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { UserAvatar } from "@/shared/ui/user-avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/ui/hover-card"
import { cn } from "@/shared/utils"
import { useSession } from "@/shared/hooks/use-session"

interface ProfileDropdownProps {
  className?: string
  dropdownWidth?: string
  sideOffset?: number
  alignOffset?: number
}

export function ProfileDropdown({
  className,
  dropdownWidth,
  sideOffset = 8,
  alignOffset = -12,
}: ProfileDropdownProps) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const handleLogout = () => {
    router.replace("/auth/signout")
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={() => router.push("/account")}
          className="cursor-pointer outline-none"
        >
          <UserAvatar user={user} className={className} isPending={isPending} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        align={isDesktop ? "end" : "start"}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          "min-w-90 flex-col space-y-0 px-0 pt-0 pb-3",
          dropdownWidth
        )}
      >
        <div>
          <div className="flex items-center gap-5 p-5 text-center text-sm">
            <UserAvatar
              user={user}
              fallbackClassName="size-20 text-4xl"
              className="size-14 text-4xl lg:size-20"
            />
            <div className="grid text-start leading-tight">
              <span className="truncate text-base font-medium text-primary">
                {user?.name ?? "User"}
              </span>
              <span className="truncate text-sm text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>
        <div className="flex flex-col justify-center gap-2.5 px-5 pt-3">
          <Link
            href="/my-learning"
            className="cursor-pointer rounded-md px-2 py-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            My Learning
          </Link>
          <Link
            href="/account/support"
            className="cursor-pointer rounded-md px-2 py-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            Help and Support
          </Link>
          <div className="h-px bg-border" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-base text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive/80"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
