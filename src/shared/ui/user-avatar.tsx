"use client"

import { cn } from "@/shared/utils"
import { Skeleton } from "@/shared/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

interface UserAvatarProps {
  user: { name?: string | null; image?: string | null } | undefined
  className?: string
  fallbackClassName?: string
  isPending?: boolean
}

export function UserAvatar({
  user,
  className,
  fallbackClassName,
  isPending,
}: UserAvatarProps) {
  if (isPending) {
    return <Skeleton className={cn("size-[50px] rounded-full", className)} />
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <Avatar className={cn("size-full bg-primary text-white", className)}>
      {user?.image ? (
        <AvatarImage src={user.image} alt={user.name ?? ""} />
      ) : null}
      <AvatarFallback
        className={cn(
          "size-full bg-primary text-primary-foreground",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
