import { AboutAiHealthcareSection } from "@/features/marketing/components/about-ai-healthcare-section"
import { AboutHeroSection } from "@/features/marketing/components/about-hero-section"
import AboutOurValuesSection from "@/features/marketing/components/about-our-values-section"

export default function AboutPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <AboutHeroSection />
      <AboutOurValuesSection />
      <AboutAiHealthcareSection />
    </main>
  )
}
