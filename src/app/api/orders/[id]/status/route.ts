import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { validate as isValidUUID } from "uuid"

import { db } from "@/infrastructure/database/client"
import { orders, enrollments } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: currentUser } = await requireSession()
    const { id } = await params

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

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

    const enrollment = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.orderId, id))
      .then((r) => r[0] ?? null)

    return NextResponse.json({ order, enrollment })
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
