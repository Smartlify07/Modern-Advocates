import { NextResponse } from "next/server"
import { eq, and, count } from "drizzle-orm"

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
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(
        and(eq(enrollments.id, eId), eq(enrollments.studentId, currentUser.id)),
      )
      .then((r) => r[0] ?? null)

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    const topic = await db
      .select({ id: courseTopics.id })
      .from(courseTopics)
      .innerJoin(courseModules, eq(courseTopics.moduleId, courseModules.id))
      .where(
        and(
          eq(courseTopics.id, tId),
          eq(courseModules.courseId, enrollment.courseId),
        ),
      )
      .then((r) => r[0] ?? null)

    if (!topic) {
      return NextResponse.json({ error: "Topic not found in this course" }, { status: 404 })
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .select({ id: enrollments.id })
        .from(enrollments)
        .where(eq(enrollments.id, eId))
        .for("update")

      const existing = await tx
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
        await tx
          .delete(topicCompletions)
          .where(eq(topicCompletions.id, existing.id))
      } else {
        await tx.insert(topicCompletions).values({
          enrollmentId: eId,
          topicId: tId,
        })
      }

      const completed = !existing

      const [{ totalTopics }] = await tx
        .select({ totalTopics: count() })
        .from(courseTopics)
        .innerJoin(courseModules, eq(courseTopics.moduleId, courseModules.id))
        .where(eq(courseModules.courseId, enrollment.courseId))

      const [{ completedTopics }] = await tx
        .select({ completedTopics: count() })
        .from(topicCompletions)
        .innerJoin(courseTopics, eq(topicCompletions.topicId, courseTopics.id))
        .innerJoin(courseModules, eq(courseTopics.moduleId, courseModules.id))
        .where(
          and(
            eq(topicCompletions.enrollmentId, eId),
            eq(courseModules.courseId, enrollment.courseId),
          ),
        )

      const progress =
        totalTopics > 0
          ? Math.round((completedTopics / totalTopics) * 100)
          : 0

      await tx
        .update(enrollments)
        .set({ progress })
        .where(eq(enrollments.id, eId))

      return { completed, progress }
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
