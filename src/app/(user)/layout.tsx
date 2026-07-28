import { redirect } from "next/navigation"
import DashboardNavbar from "@/features/user-dashboard/components/dashboard-navbar"
import { Footer } from "@/features/marketing/components/footer"
import { requireSession } from "@/infrastructure/auth/helpers"
import { isAdminRole } from "@/infrastructure/auth/roles"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireSession()

  if (isAdminRole(user.role)) {
    redirect("/admin")
  }

  return (
    <div className="min-h-svh bg-white text-ma-text">
      <DashboardNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
