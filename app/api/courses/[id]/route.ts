import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db/client"
import { courses } from "@/lib/db/schema/course"
import { requireAdmin } from "@/lib/auth/helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .then((r) => r[0])

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const course = await db
      .update(courses)
      .set(body)
      .where(eq(courses.id, id))
      .returning()
      .then((r) => r[0])

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === "Unauthorized" ? 401 : 403
      return NextResponse.json({ error: error.message }, { status })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const course = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning()
      .then((r) => r[0])

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === "Unauthorized" ? 401 : 403
      return NextResponse.json({ error: error.message }, { status })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
