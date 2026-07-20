"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
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
  avatarSize?: number
  dropdownWidth?: string
  sideOffset?: number
}

export function ProfileDropdown({
  avatarSize = 8,
  dropdownWidth = "w-56",
  sideOffset = 8,
}: ProfileDropdownProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() ?? "U"

  const handleLogout = () => {
    router.push("/auth/signout")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="cursor-pointer outline-none">
          <Avatar
            className="bg-primary text-white"
            style={{ width: `${avatarSize * 4}px`, height: `${avatarSize * 4}px` }}
          >
            <AvatarFallback className="bg-primary font-extrabold text-primary-foreground">
              {firstLetter}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={sideOffset}
        className={dropdownWidth}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            <Avatar className="size-10 bg-primary text-white">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {firstLetter}
              </AvatarFallback>
            </Avatar>
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
