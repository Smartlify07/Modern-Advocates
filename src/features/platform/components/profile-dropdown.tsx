"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

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
  dropdownWidth = "w-80",
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
        className={`${dropdownWidth} flex min-w-[360px] flex-col space-y-0 px-0 pt-0 pb-3`}
      >
        <div>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-5 p-5 text-center text-sm">
              <UserAvatar
                user={user}
                fallbackClassName="size-20 text-4xl"
                className="size-20 text-4xl"
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
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <DropdownMenuItem
            className="px-5 py-2 text-base text-muted-foreground hover:text-primary data-inset:ps-0"
            asChild
          >
            <Link href="/dashboard" className="cursor-pointer">
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-5 py-2 text-base text-muted-foreground hover:text-primary data-inset:ps-0"
            asChild
          >
            <Link href="/my-learning" className="cursor-pointer">
              My Learning
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-5 py-2 text-base text-muted-foreground hover:text-primary data-inset:ps-0"
            asChild
          >
            <Link href="/dashboard/support" className="cursor-pointer">
              Help and Support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="mt-0" />
          <DropdownMenuItem
            onClick={handleLogout}
            variant="destructive"
            className="cursor-pointer px-5 py-2 text-base text-destructive hover:text-destructive focus:text-destructive"
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
