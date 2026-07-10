import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, enrollments } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: currentUser } = await requireSession()
    const { id } = await params

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .then((r) => r[0])

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.studentId !== currentUser.id) {
      throw new ForbiddenError()
    }

    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Cannot retry enrollment — order is not paid" },
        { status: 400 },
      )
    }

    const existing = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.orderId, id))
      .then((r) => r[0])

    if (existing && existing.status === "active") {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 })
    }

    let enrollment
    if (existing && existing.status === "failed") {
      const [updated] = await db
        .update(enrollments)
        .set({ status: "active" })
        .where(eq(enrollments.id, existing.id))
        .returning()
      enrollment = updated
    } else {
      const [created] = await db
        .insert(enrollments)
        .values({
          orderId: id,
          studentId: currentUser.id,
          courseId: order.courseId,
          status: "active",
        })
        .returning()
      enrollment = created
    }

    return NextResponse.json({ enrollment })
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
