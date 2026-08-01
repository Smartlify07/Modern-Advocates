import { redirect } from "next/navigation"
import { isAdminRole } from "@/infrastructure/auth/roles"
import { requireSession } from "@/infrastructure/auth/helpers"
import AdminLayoutClient from "./admin-layout-client"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireSession()

  if (!isAdminRole(user.role)) {
    redirect("/login")
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
