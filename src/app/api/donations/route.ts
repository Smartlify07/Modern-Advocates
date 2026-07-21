import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { donations } from "@/infrastructure/database/schema/donation"
import { getStripe } from "@/infrastructure/payment/stripe"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const { amount, donorName, donorEmail, donationType } = await request.json()

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "A valid amount is required" },
        { status: 400 },
      )
    }

    if (!donorName || typeof donorName !== "string") {
      return NextResponse.json(
        { error: "Donor name is required" },
        { status: 400 },
      )
    }

    if (!donorEmail || typeof donorEmail !== "string") {
      return NextResponse.json(
        { error: "Donor email is required" },
        { status: 400 },
      )
    }

    if (!donationType || !["fixed", "tier", "monthly"].includes(donationType)) {
      return NextResponse.json(
        { error: "A valid donation type is required" },
        { status: 400 },
      )
    }

    const donationId = randomUUID()

    const [donation] = await db
      .insert(donations)
      .values({
        id: donationId,
        donorName,
        donorEmail,
        amount,
        donationType,
        paymentStatus: "pending",
      })
      .returning()

    if (!donation) {
      return NextResponse.json(
        { error: "Failed to create donation record" },
        { status: 500 },
      )
    }

    const origin =
      request.headers.get("origin") ??
      `${request.headers.get("x-forwarded-proto") ?? "https"}://${request.headers.get("host") ?? "localhost:3000"}`

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "Donation to Modern Advocates",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        donationId,
      },
      success_url: `${origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donation`,
    })

    await db
      .update(donations)
      .set({ stripeCheckoutSessionId: session.id })
      .where(eq(donations.id, donationId))

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error(error)
    Sentry.captureException(error, { tags: { route: "api/donations" } })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
