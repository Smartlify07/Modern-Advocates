import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import { courses } from "@/infrastructure/database/schema/course"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { isValidUuid } from "@/shared/utils"
import * as Sentry from "@sentry/nextjs"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireInstructorOrAdmin()
    const { id } = await params

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const updated = await db
      .update(courses)
      .set({ status: "archived" })
      .where(eq(courses.id, id))
      .returning()
      .then((r) => r[0])

    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
