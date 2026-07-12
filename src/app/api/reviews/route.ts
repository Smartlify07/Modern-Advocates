import { NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import {
  enrollments,
  reviews,
} from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const { user: currentUser } = await requireSession()

    const { courseId, rating, body } = await request.json()

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      )
    }

    const ratingNum = Number(rating)
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "rating must be an integer between 1 and 5" },
        { status: 400 }
      )
    }

    if (body !== undefined && typeof body !== "string") {
      return NextResponse.json(
        { error: "body must be a string" },
        { status: 400 }
      )
    }

    const enrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.courseId, courseId),
          eq(enrollments.studentId, currentUser.id)
        )
      )
      .then((r) => r[0])

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      )
    }

    if (enrollment.status !== "active") {
      return NextResponse.json(
        { error: "Your enrollment is not active" },
        { status: 403 }
      )
    }

    const [review] = await db
      .insert(reviews)
      .values({
        courseId,
        studentId: currentUser.id,
        rating: ratingNum,
        body: body ?? null,
      })
      .onConflictDoNothing()
      .returning()

    if (!review) {
      return NextResponse.json(
        { error: "You have already reviewed this course" },
        { status: 409 }
      )
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
