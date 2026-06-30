"use client"

import { Button } from "@/shared/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Donation", href: "/donation" },
  { label: "Login", href: "/login" },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative z-20 bg-white px-4 py-5 xl:px-25 2xl:px-50">
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex w-[157px] flex-col gap-1">
          <Image
            src="/figma-home/logo.svg"
            alt="ModernAdvocates Inc."
            width={58}
            height={44}
            priority
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 text-ma-text md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-2.5 text-base transition-colors duration-300 hover:text-[#6B7280]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          className="group relative hidden overflow-hidden md:inline-flex"
        >
          <Link href="/contact" className="flex h-13 w-[157px] items-center justify-center gap-[6px] rounded-[60px] px-5 py-4">
            <span className="relative z-10">Consultation</span>
            <ArrowRight className="relative z-10 size-3.5 transition-transform duration-300 group-hover:rotate-[-30deg]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
        </Button>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="size-10 rounded-[12px] border p-2 md:hidden"
        >
          {mobileOpen ? (
            <X className="size-6 text-[#6B7280]" />
          ) : (
            <Menu className="size-6 text-[#6B7280]" />
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
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
              className={`rounded-lg p-3 text-base transition-all duration-300 hover:bg-gray-50 ${
                mobileOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
              style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            className="group relative mt-2 overflow-hidden"
          >
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex h-13 w-full items-center justify-center gap-[6px] rounded-[60px] px-5 py-4">
              <span className="relative z-10">Consultation</span>
              <ArrowRight className="relative z-10 size-3.5 transition-transform duration-300 group-hover:rotate-[30deg]" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
