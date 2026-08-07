import { AboutHeroSection } from "@/features/marketing/components/about-hero-section"
import AboutSupportMissionSection from "@/features/marketing/components/about-support-mission-section"
import HowCanWeHelpSection from "@/features/marketing/components/how-can-we-help"
import OurVisionSection from "@/features/marketing/components/our-vision-section"

export default function AboutPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <AboutHeroSection />
      <HowCanWeHelpSection />
      <OurVisionSection />
      <AboutSupportMissionSection />
    </main>
  )
}
