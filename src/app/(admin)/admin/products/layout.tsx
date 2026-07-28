import { redirect } from "next/navigation"
import { isManagerOrAdmin } from "@/infrastructure/auth/roles"
import { getSessionSafe } from "@/infrastructure/auth/helpers"

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionSafe()

  if (!session || !isManagerOrAdmin(session.user.role)) {
    redirect("/admin")
  }

  return children
}
