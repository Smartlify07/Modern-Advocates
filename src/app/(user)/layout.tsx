import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
import DashboardNavbar from "@/features/user-dashboard/components/dashboard-navbar"
import { Footer } from "@/features/marketing/components/footer"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-svh bg-white text-ma-text">
      <DashboardNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
