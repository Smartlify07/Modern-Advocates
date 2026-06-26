import { Button } from "@/shared/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "#courses" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Donation", href: "#donation" },
  { label: "Login", href: "/login" },
]
const Navbar = () => {
  return (
    <header className="relative z-20 bg-white py-5">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex flex-col items-center gap-1">
          <Image
            src="/figma-home/logo.svg"
            alt="ModernAdvocates Inc."
            width={58}
            height={44}
            className="h-8 w-11"
            priority
          />
          <span className="text-[5px] leading-none font-bold">
            ModernAdvocates Inc
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 text-ma-text md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font p-2.5 text-base transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          className="h-13 w-[157px] gap-[6px] rounded-[60px] px-5 py-4"
        >
          <Link href="#contact">
            Consultation
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default Navbar
