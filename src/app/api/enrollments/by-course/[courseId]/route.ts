import { NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { enrollments, topicCompletions } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { user: currentUser } = await requireSession()
    const { courseId } = await params

    const enrollment = await db
      .select({ id: enrollments.id, progress: enrollments.progress })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, currentUser.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .then((r) => r[0] ?? null)

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    const rows = await db
      .select({ topicId: topicCompletions.topicId })
      .from(topicCompletions)
      .where(eq(topicCompletions.enrollmentId, enrollment.id))

    const completedTopicIds = rows.map((r) => r.topicId)

    return NextResponse.json({ ...enrollment, completedTopicIds })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
