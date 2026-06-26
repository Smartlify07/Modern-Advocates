import Navbar from "@/features/marketing/components/navbar"
import { CtaSection } from "@/features/marketing/components/cta-section"
import { Footer } from "@/features/marketing/components/footer"

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      {children}
      <CtaSection />
      <Footer />
    </>
  )
}
