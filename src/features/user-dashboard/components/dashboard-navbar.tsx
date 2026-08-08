"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Bell, Menu, X } from "lucide-react"

import { ProfileDropdown } from "@/features/platform/components/profile-dropdown"

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Learning", href: "/my-learning" },
]

export default function DashboardNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white">
      <div className="marketing-container relative z-20 mx-auto px-0! py-5!">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <ProfileDropdown
              className="size-10"
              dropdownWidth="min-w-0 w-72"
              sideOffset={12}
              alignOffset={8}
            />
          </div>
          <Link
            href="/dashboard"
            className="hidden w-[157px] flex-col gap-1 md:flex"
          >
            <Image
              src="/figma-home/logo.svg"
              alt="ModernAdvocates Inc."
              width={58}
              height={44}
              priority
            />
          </Link>

          <div className="hidden items-center gap-2 text-ma-text md:flex">
            <nav
              aria-label="Dashboard navigation"
              className="flex items-center gap-2"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2.5 text-base transition-colors duration-300 hover:text-muted-foreground ${pathname === item.href || pathname.startsWith(item.href + "/") ? "text-primary" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Bell className="size-5 text-muted-foreground" />
              <ProfileDropdown className="size-12.5" dropdownWidth="w-64" />
            </div>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="size-10 rounded-[12px] border p-2 md:hidden"
          >
            {mobileOpen ? (
              <X className="size-6 text-muted-foreground" />
            ) : (
              <Menu className="size-6 text-muted-foreground" />
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${mobileOpen ? "mt-4 max-h-100 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 border-t border-gray-100 pt-4"
          >
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg p-3 text-base transition-all duration-300 hover:text-muted-foreground ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"} ${pathname === item.href || pathname.startsWith(item.href + "/") ? "text-primary" : ""}`}
                style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
