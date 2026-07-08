import CoursePlayerNavbar from "@/features/user-dashboard/components/course-player-navbar"
import { Footer } from "@/features/marketing/components/footer"

export default function CoursePlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-white text-ma-text">
      <CoursePlayerNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
