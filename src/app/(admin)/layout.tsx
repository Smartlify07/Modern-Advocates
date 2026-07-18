import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
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

  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return <AdminLayoutClient userName={session.user.name}>{children}</AdminLayoutClient>
}
