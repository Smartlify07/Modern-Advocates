import Navbar from "@/features/marketing/components/navbar"
import { ConditionalLayoutSections } from "@/features/marketing/components/conditional-layout-sections"
import { Footer } from "@/features/marketing/components/footer"

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-white">
      <Navbar />
      {children}
      <ConditionalLayoutSections />

      <Footer />
    </div>
  )
}
