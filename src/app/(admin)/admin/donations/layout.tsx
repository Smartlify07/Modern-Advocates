import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"

export default async function DonationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = session?.user.role
  if (role !== "admin" && role !== "manager") {
    redirect("/admin")
  }

  return children
}
