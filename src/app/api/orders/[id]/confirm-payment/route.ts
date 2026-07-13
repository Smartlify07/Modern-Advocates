import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { validate as isValidUUID } from "uuid"

import { db } from "@/infrastructure/database/client"
import { orders } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { getStripe } from "@/infrastructure/payment/stripe"
import { completeOrder } from "@/features/orders/services/order-service"
import * as Sentry from "@sentry/nextjs"

export async function POST(
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

    if (order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 409 })
    }

    if (order.stripePaymentIntentId) {
      const stripe = getStripe()
      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId,
      )

      if (paymentIntent.status !== "succeeded") {
        return NextResponse.json(
          { error: `Payment not confirmed (status: ${paymentIntent.status})` },
          { status: 400 },
        )
      }
    }

    const result = await completeOrder(id)

    return NextResponse.json(result)
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
