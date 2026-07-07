import DashboardNavbar from "@/features/user-dashboard/components/dashboard-navbar"
import { Footer } from "@/features/marketing/components/footer"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-white text-ma-text">
      <DashboardNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
