import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, enrollments, courses } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const { user: currentUser } = await requireSession()

    const { courseId } = await request.json()

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    const course = await db
      .select({ id: courses.id, price: courses.price, discountedPrice: courses.discountedPrice })
      .from(courses)
      .where(eq(courses.id, courseId))
      .then((r) => r[0])

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const amount = course.discountedPrice ?? course.price

    const [order] = await db
      .insert(orders)
      .values({
        studentId: currentUser.id,
        courseId,
        amount,
        paymentStatus: "paid",
        source: "purchase",
      })
      .returning()

    let enrollment = null
    try {
      const [enr] = await db
        .insert(enrollments)
        .values({
          orderId: order.id,
          studentId: currentUser.id,
          courseId,
          status: "active",
        })
        .onConflictDoNothing()
        .returning()
      enrollment = enr
    } catch {
      // enrollment is optional — order is preserved regardless
    }

    return NextResponse.json({ order, enrollment }, { status: 201 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
