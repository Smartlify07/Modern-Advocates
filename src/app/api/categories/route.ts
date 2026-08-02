import { NextResponse } from "next/server"
import { db } from "@/infrastructure/database/client"
import { categories } from "@/infrastructure/database/schema/course"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async () => {
  await requireAdmin()

  const allCategories = await db.select().from(categories).orderBy(categories.name)

  return NextResponse.json(allCategories)
})
