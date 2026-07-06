import { NextResponse } from "next/server"
import { db } from "@/infrastructure/database/client"
import { categories } from "@/infrastructure/database/schema/course"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"

export async function GET() {
  try {
    await requireAdmin()

    const allCategories = await db.select().from(categories).orderBy(categories.name)

    return NextResponse.json(allCategories)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
