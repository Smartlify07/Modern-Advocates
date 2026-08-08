import { NextResponse } from "next/server"
import { eq, sql, desc } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import {
  courses,
  orders,
  enrollments,
  reviews,
} from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import { resolveStoredUrl } from "@/infrastructure/storage/service"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const { user: currentUser } = await requireSession()

    const { courseId, orderId } = await request.json()

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      )
    }
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      )
    }

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .then((r) => r[0])

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    if (order.studentId !== currentUser.id) {
      return NextResponse.json(
        { error: "Order does not belong to user" },
        { status: 400 }
      )
    }
    if (order.paymentStatus !== "paid") {
      return NextResponse.json({ error: "Order is not paid" }, { status: 400 })
    }
    if (order.courseId !== courseId) {
      return NextResponse.json(
        { error: "Order does not match the requested course" },
        { status: 400 }
      )
    }

    const [enrollment] = await db
      .insert(enrollments)
      .values({
        courseId,
        studentId: currentUser.id,
        orderId,
        status: "active",
      })
      .onConflictDoNothing()
      .returning()

    if (!enrollment) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 })
    }

    return NextResponse.json(enrollment, { status: 201 })
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

export async function GET() {
  try {
    const { user: currentUser } = await requireSession()

    const enrolled = await db
      .select({
        id: courses.id,
        title: courses.title,
        overview: courses.overview,
        thumbnailUrl: courses.thumbnailUrl,
        thumbnailKey: courses.thumbnailKey,
        level: courses.level,
        price: courses.price,
        discountedPrice: courses.discountedPrice,
        duration: courses.duration,
        progress: enrollments.progress,
        instructorName: courses.instructorName,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(enrollments)
      .innerJoin(courses, eq(courses.id, enrollments.courseId))
      .leftJoin(reviews, eq(reviews.courseId, courses.id))
      .where(eq(enrollments.studentId, currentUser.id))
      .groupBy(
        enrollments.progress,
        courses.id,
        courses.title,
        courses.overview,
        courses.thumbnailUrl,
        courses.thumbnailKey,
        courses.level,
        courses.price,
        courses.discountedPrice,
        courses.duration
      )
      .orderBy(desc(courses.createdAt))

    const resolved = await Promise.all(
      enrolled.map(async ({ thumbnailKey, ...course }) => ({
        ...course,
        thumbnailUrl: await resolveStoredUrl(thumbnailKey, course.thumbnailUrl),
      })),
    )

    return NextResponse.json(resolved)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    console.error(error)
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
