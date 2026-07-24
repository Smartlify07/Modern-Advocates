"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { User, LogOut, MessageCircleMore } from "lucide-react"

import { authClient } from "@/infrastructure/auth/client"
import { cn } from "@/shared/utils"
import { AccountSessionContext } from "./_context"

const navItems = [
  { label: "Profile", href: "/account", icon: User },
  {
    label: "Help & Support",
    href: "/account/support",
    icon: MessageCircleMore,
  },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending, refetch } = authClient.useSession()

  const handleLogout = () => {
    router.replace("/auth/signout")
  }

  return (
    <AccountSessionContext.Provider
      value={{ user: session?.user, isPending, refetchSession: refetch }}
    >
      <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-ma-text">
          Account
        </h1>

        <div className="flex flex-col items-start gap-30 lg:flex-row">
          <nav className="flex shrink-0 flex-col gap-10 border-border pr-0 lg:min-w-[200px] lg:border-r lg:pr-25">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors",
                  pathname === item.href
                    ? "bg-muted font-semibold text-ma-text"
                    : "text-muted-foreground hover:text-ma-text"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-destructive transition-colors hover:text-destructive/80"
            >
              <LogOut className="size-5" />
              Log out
            </button>
          </nav>

          {children}
        </div>
      </div>
    </AccountSessionContext.Provider>
  )
}
