"use client"

import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/utils"
import { ArrowRight, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Trainings", href: "/courses" },
  { label: "Donation", href: "/donation" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/70 backdrop-blur-lg" : "bg-white"
      }`}
    >
      <div className="relative z-20 mx-auto px-4 py-5 lg:max-w-7xl lg:px-12.5 xl:px-25 2xl:max-w-360">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex w-[195px] flex-col gap-1">
            <Image
              src="/figma-home/ma-logo.svg"
              alt="ModernAdvocates Inc."
              width={190}
              height={52}
              priority
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-2 text-ma-text lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-2.5 text-base transition-colors duration-300 hover:text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            asChild
            className="group relative hidden overflow-hidden rounded-pill lg:inline-flex"
          >
            <Link
              href="/contact"
              className="flex h-13 w-[157px] items-center justify-center gap-[6px] rounded-pill px-5 py-4 text-base font-semibold"
            >
              <span className="relative z-10">Consultation</span>
              <ArrowRight
                className="relative z-10 size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
          </Button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="size-10 rounded-[12px] border p-2 lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-6 text-muted-foreground" />
            ) : (
              <Menu className="size-6 text-muted-foreground" />
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "mt-4 max-h-100 opacity-100" : "max-h-0 opacity-0"
          }`}
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
                className={cn(
                  "rounded-lg p-3 text-base transition-all duration-300 hover:text-muted-foreground",
                  mobileOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0",
                  item.href === pathname && "text-muted-foreground"
                )}
                style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="group relative mt-2 overflow-hidden rounded-pill bg-ma-admin-primary"
            >
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex h-13 w-full items-center justify-center gap-[6px] rounded-pill px-5 py-4"
              >
                <span className="relative z-10">Consultation</span>
                <ArrowRight
                  className="relative z-10 hidden size-3.5 transition-transform duration-300 group-hover:rotate-[30deg] lg:inline"
                  aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
