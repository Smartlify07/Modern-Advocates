import { NextResponse } from "next/server"
import { eq, and, sql, count } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import {
  enrollments,
  courseModules,
  courseTopics,
  topicCompletions,
} from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ eId: string; tId: string }> },
) {
  try {
    const { user: currentUser } = await requireSession()
    const { eId, tId } = await params

    const enrollment = await db
      .select({ courseId: enrollments.courseId, progress: enrollments.progress })
      .from(enrollments)
      .where(
        and(eq(enrollments.id, eId), eq(enrollments.studentId, currentUser.id)),
      )
      .then((r) => r[0] ?? null)

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    const existing = await db
      .select({ id: topicCompletions.id })
      .from(topicCompletions)
      .where(
        and(
          eq(topicCompletions.enrollmentId, eId),
          eq(topicCompletions.topicId, tId),
        ),
      )
      .then((r) => r[0] ?? null)

    if (existing) {
      await db
        .delete(topicCompletions)
        .where(eq(topicCompletions.id, existing.id))
    } else {
      await db.insert(topicCompletions).values({
        enrollmentId: eId,
        topicId: tId,
      })
    }

    const completed = !existing

    const [{ totalTopics }] = await db
      .select({ totalTopics: count() })
      .from(courseTopics)
      .innerJoin(
        courseModules,
        eq(courseTopics.moduleId, courseModules.id),
      )
      .where(eq(courseModules.courseId, enrollment.courseId))

    const [{ completedTopics }] = await db
      .select({ completedTopics: count() })
      .from(topicCompletions)
      .where(eq(topicCompletions.enrollmentId, eId))

    const progress =
      totalTopics > 0
        ? Math.round((completedTopics / totalTopics) * 100)
        : 0

    await db
      .update(enrollments)
      .set({ progress })
      .where(eq(enrollments.id, eId))

    return NextResponse.json({ completed, progress })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
