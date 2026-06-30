import { HeroSection } from "@/features/marketing/components/hero-section"
import {
  FounderStorySection,
  MissionBridgeSection,
} from "@/features/marketing/components/mission-sections"
import { FeaturedCourses } from "@/features/marketing/components/featured-courses"
import { HowItWorks } from "@/features/marketing/components/how-it-works"
import { Testimonials } from "@/features/marketing/components/testimonials"
import { Faq } from "@/features/marketing/components/faq"
import SupportSection from "@/features/marketing/components/how-can-we-support"

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <HeroSection />

      <MissionBridgeSection />
      <FounderStorySection />
      <SupportSection />
      <Testimonials />
    </main>
  )
}
