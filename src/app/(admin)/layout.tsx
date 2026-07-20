import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
import { isAdminRole } from "@/infrastructure/auth/roles"
import AdminLayoutClient from "./admin-layout-client"

export default async function AdminLayout({
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

  if (!isAdminRole(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <AdminLayoutClient userName={session.user.name} role={session.user.role}>
      {children}
    </AdminLayoutClient>
  )
}
