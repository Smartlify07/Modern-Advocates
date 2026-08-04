import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import { donations } from "@/infrastructure/database/schema/donation"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async () => {
  await requireAdmin()
  const result = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt))
  return NextResponse.json(result)
})
