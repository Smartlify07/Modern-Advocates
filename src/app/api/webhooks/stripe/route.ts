import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import type Stripe from "stripe"

import { db } from "@/infrastructure/database/client"
import { orders } from "@/infrastructure/database/schema/course"
import { getStripe } from "@/infrastructure/payment/stripe"
import { completeOrder } from "@/features/orders/services/order-service"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 401 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      Sentry.captureMessage("STRIPE_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    const stripe = getStripe()
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      Sentry.captureException(err, { tags: { webhook: "stripe" } })
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const stripePaymentIntentId = paymentIntent.id

        const order = await db
          .select()
          .from(orders)
          .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId))
          .then((r) => r[0])

        if (!order) {
          Sentry.captureMessage("Order not found for completed PaymentIntent", {
            extra: { stripePaymentIntentId },
          })
          return NextResponse.json({ received: true })
        }

        if (order.paymentStatus === "paid") {
          return NextResponse.json({ success: true })
        }

        await completeOrder(order.id)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const stripePaymentIntentId = paymentIntent.id
        const lastError = paymentIntent.last_payment_error?.message ?? "Unknown error"

        const order = await db
          .select()
          .from(orders)
          .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId))
          .then((r) => r[0])

        if (order && order.paymentStatus === "pending") {
          await db
            .update(orders)
            .set({ paymentStatus: "failed" })
            .where(eq(orders.id, order.id))
        }

        Sentry.captureMessage("Stripe payment failed", {
          extra: { stripePaymentIntentId, error: lastError },
        })
        break
      }

      default:
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { webhook: "stripe" },
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
