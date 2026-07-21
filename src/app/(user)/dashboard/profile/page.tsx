"use client"

import { authClient } from "@/infrastructure/auth/client"
import { UserAvatar } from "@/shared/ui/user-avatar"

export default function UserProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 lg:py-19.25 2xl:max-w-360 2xl:px-50">
      <h1 className="mb-10 text-[28px]/[100%] font-bold text-primary lg:mb-12.5 lg:text-[32px]/[100%]">
        Profile
      </h1>
      <div className="flex items-center gap-6 rounded-xl border p-6">
        <UserAvatar user={user} className="size-[50px]" />
        <div className="grid gap-1">
          <p className="text-xl font-semibold text-ma-text">{user?.name ?? "User"}</p>
          <p className="text-muted-foreground">{user?.email ?? ""}</p>
        </div>
      </div>
    </div>
  )
}
