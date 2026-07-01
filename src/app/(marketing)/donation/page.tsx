import { DonationCtaSection } from "@/features/marketing/components/donation-cta-section"
import { DonationHeroSection } from "@/features/marketing/components/donation-hero-section"
import { DonationSupportSection } from "@/features/marketing/components/donation-support-section"

export default function DonationPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <DonationHeroSection />
      <DonationSupportSection />
      <DonationCtaSection />
    </main>
  )
}
