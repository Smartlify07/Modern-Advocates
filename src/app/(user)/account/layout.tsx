"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { User, LogOut, MessageCircleMore } from "lucide-react"

import { cn } from "@/shared/utils"
import { useSession } from "@/shared/hooks/use-session"

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
  const { error: sessionError } = useSession()

  const handleLogout = () => {
    router.replace("/auth/signout")
  }

  return (
    <div className="marketing-container px-4 py-8">
      {sessionError && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load session. Please try refreshing the page.
        </div>
      )}
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-ma-text">
        Account
      </h1>

      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-30">
        <nav className="flex w-full shrink-0 flex-col border-border lg:max-w-[290px] lg:min-w-[200px] lg:gap-10 lg:border-r lg:pr-25">
          <div className="flex lg:flex-col lg:gap-10 lg:border-b-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-start gap-3 border-b px-4 py-3 text-sm transition-colors lg:justify-start lg:rounded-lg lg:border-b-0 lg:px-4 lg:py-2.5 lg:text-base",
                  pathname === item.href
                    ? "border-ma-text font-semibold text-ma-text lg:bg-muted"
                    : "border-transparent text-muted-foreground hover:text-ma-text"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 hidden items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive/80 md:flex lg:mt-0"
          >
            <LogOut className="size-5" />
            Log out
          </button>
        </nav>

        {children}
      </div>
    </div>
  )
}
