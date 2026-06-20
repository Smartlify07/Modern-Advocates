import { NextResponse } from "next/server"
import { db } from "@/infrastructure/database/client"
import { categories } from "@/infrastructure/database/schema/course"
import { requireAdmin } from "@/infrastructure/auth/helpers"

export async function GET() {
  try {
    await requireAdmin()

    const allCategories = await db.select().from(categories).orderBy(categories.name)

    return NextResponse.json(allCategories)
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === "Unauthorized" ? 401 : 403
      return NextResponse.json({ error: error.message }, { status })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
