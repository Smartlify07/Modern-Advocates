import { HeroSection } from "@/features/marketing/components/hero-section"

import { EmpowermentSection } from "@/features/marketing/components/empowerment-section"
import CommunitySection from "@/features/marketing/components/community-section"
import PracticalPathwaysSection from "@/features/marketing/components/practical-pathways-section"
import { StoriesSection } from "@/features/marketing/components/stories-from-our-community-section"
import InvestInHopeSection from "@/features/marketing/components/invest-in-hope-section"

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <HeroSection />

      <EmpowermentSection />
      <CommunitySection />
      <PracticalPathwaysSection />
      <StoriesSection />
      <InvestInHopeSection />
    </main>
  )
}
