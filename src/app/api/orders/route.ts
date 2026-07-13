import { NextResponse } from "next/server"
import { eq, and, desc } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import {
  orders,
  enrollments,
  courses,
} from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import { getStripe } from "@/infrastructure/payment/stripe"
import * as Sentry from "@sentry/nextjs"
import { completeOrder } from "@/features/orders/services/order-service"
export async function POST(request: Request) {
  try {
    const { user: currentUser } = await requireSession()

    const { courseId } = await request.json()

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      )
    }

    const course = await db
      .select({
        id: courses.id,
        price: courses.price,
        discountedPrice: courses.discountedPrice,
        isFree: courses.isFree,
      })
      .from(courses)
      .where(eq(courses.id, courseId))
      .then((r) => r[0])

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const existingEnrollment = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, currentUser.id),
          eq(enrollments.courseId, courseId),
          eq(enrollments.status, "active")
        )
      )
      .then((r) => r[0])

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 })
    }

    const existingOrder = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.studentId, currentUser.id), eq(orders.courseId, courseId))
      )
      .orderBy(desc(orders.createdAt))
      .then((r) => r[0])

    if (existingOrder && existingOrder.paymentStatus === "paid") {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 })
    }

    if (existingOrder && existingOrder.stripePaymentIntentId) {
      const stripe = getStripe()
      const paymentIntent = await stripe.paymentIntents.retrieve(
        existingOrder.stripePaymentIntentId
      )

      if (
        paymentIntent.status === "requires_payment_method" ||
        paymentIntent.status === "requires_confirmation"
      ) {
        return NextResponse.json({
          orderId: existingOrder.id,
          clientSecret: paymentIntent.client_secret,
        })
      }
    }

    const amount = course.discountedPrice ?? course.price

    if (course.isFree) {
      const [inserted] = await db
        .insert(orders)
        .values({
          studentId: currentUser.id,
          courseId,
          amount,
          paymentStatus: "pending",
          source: "purchase",
        })
        .onConflictDoNothing()
        .returning()

      const order = inserted ?? existingOrder!

      if (!order) {
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        )
      }

      const result = await completeOrder(order.id)
      return NextResponse.json(result, { status: 201 })
    }

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        courseId,
        userId: currentUser.id,
      },
    })

    const [inserted] = await db
      .insert(orders)
      .values({
        studentId: currentUser.id,
        courseId,
        amount,
        paymentStatus: "pending",
        stripePaymentIntentId: paymentIntent.id,
        paymentProvider: "stripe",
        source: "purchase",
      })
      .onConflictDoNothing()
      .returning()

    const order = inserted ?? existingOrder!

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
    })
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
