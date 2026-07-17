"use client"

import { authClient } from "@/infrastructure/auth/client"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"

export default function UserProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 lg:py-19.25 2xl:max-w-360 2xl:px-50">
      <h1 className="mb-10 text-[28px]/[100%] font-bold text-primary lg:mb-12.5 lg:text-[32px]/[100%]">
        Profile
      </h1>
      <div className="flex items-center gap-6 rounded-xl border p-6">
        <Avatar className="size-20 bg-primary text-white">
          <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <p className="text-xl font-semibold text-ma-text">{user?.name ?? "User"}</p>
          <p className="text-muted-foreground">{user?.email ?? ""}</p>
        </div>
      </div>
    </div>
  )
}
