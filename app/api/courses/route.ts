import { NextResponse } from "next/server"

import { db } from "@/lib/db/client"
import { courses } from "@/lib/db/schema/course"
import { requireAdmin } from "@/lib/auth/helpers"

export async function POST(request: Request) {
  try {
    const { user: adminUser } = await requireAdmin()
    const body = await request.json()

    const course = await db
      .insert(courses)
      .values({
        title: body.title,
        content: body.content,
        overview: body.overview,
        thumbnailUrl: body.thumbnailUrl,
        language: body.language ?? "en",
        level: body.level,
        price: body.price ?? 0,
        discountedPrice: body.discountedPrice,
        duration: body.duration,
        status: body.status ?? "draft",
        tutorId: adminUser.id,
      })
      .returning()

    return NextResponse.json(course[0], { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === "Unauthorized" ? 401 : 403
      return NextResponse.json({ error: error.message }, { status })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
