"use client"

import { usePathname } from "next/navigation"
import { CtaSection } from "@/features/marketing/components/cta-section"
import { Faq } from "@/features/marketing/components/faq"

export function ConditionalLayoutSections() {
  const pathname = usePathname()

  const showFaq = pathname === "/" || pathname === "/about"
  const showCta = !["/donation", "/login", "/signup"].includes(pathname)

  return (
    <>
      {showFaq && <Faq />}
      {showCta && <CtaSection />}
    </>
  )
}
