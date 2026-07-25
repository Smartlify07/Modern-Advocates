import { NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { enrollments } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import { isValidUuid } from "@/shared/utils"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { user: currentUser } = await requireSession()
    const { courseId } = await params

    if (!isValidUuid(courseId)) {
      return NextResponse.json({ enrolled: false })
    }

    const enrollment = await db
      .select({ id: enrollments.id, status: enrollments.status })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, currentUser.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .then((r) => r[0] ?? null)

    const enrolled = enrollment?.status === "active"

    return NextResponse.json({ enrolled })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
