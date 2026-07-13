import { NextResponse } from "next/server"
import { eq, desc } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, courses } from "@/infrastructure/database/schema/course"
import { user } from "@/infrastructure/database/schema/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    await requireAdmin()

    const transactions = await db
      .select({
        id: orders.id,
        amount: orders.amount,
        currency: orders.currency,
        paymentStatus: orders.paymentStatus,
        paymentProvider: orders.paymentProvider,
        stripePaymentIntentId: orders.stripePaymentIntentId,
        source: orders.source,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        student: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        course: {
          id: courses.id,
          title: courses.title,
        },
      })
      .from(orders)
      .leftJoin(user, eq(orders.studentId, user.id))
      .leftJoin(courses, eq(orders.courseId, courses.id))
      .orderBy(desc(orders.createdAt))

    return NextResponse.json(transactions)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
