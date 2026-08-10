import { AboutHeroSection } from "@/features/marketing/components/about-hero-section"
import { AboutImpactCarouselSection } from "@/features/marketing/components/about-impact-carousel-section"
import AboutSupportMissionSection from "@/features/marketing/components/about-support-mission-section"
import HowCanWeHelpSection from "@/features/marketing/components/how-can-we-help"
import OurVisionSection from "@/features/marketing/components/our-vision-section"

export default function AboutPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <AboutHeroSection />
      <AboutImpactCarouselSection />
      <HowCanWeHelpSection />
      <OurVisionSection />
      <AboutSupportMissionSection />
    </main>
  )
}
