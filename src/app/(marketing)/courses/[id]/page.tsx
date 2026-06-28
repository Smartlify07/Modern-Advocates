import { CourseDetailHeroSection } from "@/features/marketing/components/course-detail-hero-section"
import { CourseDetailContentSection } from "@/features/marketing/components/course-detail-content-section"

export default function CourseDetailPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <CourseDetailHeroSection />
      <CourseDetailContentSection />
    </main>
  )
}
