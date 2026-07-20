"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut } from "lucide-react"

import { UserAvatar } from "@/shared/ui/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { authClient } from "@/infrastructure/auth/client"

interface ProfileDropdownProps {
  className?: string
  dropdownWidth?: string
  sideOffset?: number
}

export function ProfileDropdown({
  className,
  dropdownWidth = "w-56",
  sideOffset = 8,
}: ProfileDropdownProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const handleLogout = () => {
    router.replace("/auth/signout")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="cursor-pointer outline-none">
          <UserAvatar user={user} className={className} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={sideOffset}
        className={dropdownWidth}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            <UserAvatar user={user} className="size-10" />
            <div className="grid flex-1 text-start leading-tight">
              <span className="truncate text-base font-medium text-primary">
                {user?.name ?? "User"}
              </span>
              <span className="truncate text-sm text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 text-base" asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <User />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          className="cursor-pointer p-2 text-base text-destructive hover:text-destructive focus:text-destructive"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
