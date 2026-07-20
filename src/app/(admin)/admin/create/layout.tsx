import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
import { isManagerOrAdmin } from "@/infrastructure/auth/roles"

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!isManagerOrAdmin(session?.user.role)) {
    redirect("/admin")
  }

  return children
}
