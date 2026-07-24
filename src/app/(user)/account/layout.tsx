"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { User, MessageSquare, LogOut } from "lucide-react"

import { cn } from "@/shared/utils"

const navItems = [
  { label: "Profile", href: "/account", icon: User },
  { label: "Help & Support", href: "/account/support", icon: MessageSquare },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    router.replace("/auth/signout")
  }

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-ma-text">
        Account
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav className="flex shrink-0 flex-col gap-2 border-border pr-0 lg:min-w-[200px] lg:border-r lg:pr-25">
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
            className="mt-4 flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-destructive transition-colors hover:text-destructive/80"
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
