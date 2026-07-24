"use client"

import { cn } from "@/shared/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

interface UserAvatarProps {
  user: { name?: string | null; image?: string | null } | undefined
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({
  user,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <Avatar className={cn("size-[50px] bg-primary text-white", className)}>
      {user?.image ? (
        <AvatarImage src={user.image} alt={user.name ?? ""} />
      ) : null}
      <AvatarFallback
        className={cn("bg-primary text-primary-foreground", fallbackClassName)}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
