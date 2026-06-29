import Navbar from "@/features/marketing/components/navbar"
import { CtaSection } from "@/features/marketing/components/cta-section"
import { Footer } from "@/features/marketing/components/footer"
import { Faq } from "@/features/marketing/components/faq"

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-white">
      <Navbar />
      {children}
      <Faq />
      <CtaSection />

      <Footer />
    </div>
  )
}
