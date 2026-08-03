import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { donations } from "@/infrastructure/database/schema/donation"
import { getStripe } from "@/infrastructure/payment/stripe"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 },
    )
  }

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: `Payment not completed (status: ${session.payment_status})` },
      { status: 400 },
    )
  }

  const donation = await db
    .select()
    .from(donations)
    .where(eq(donations.stripeCheckoutSessionId, sessionId))
    .then((r) => r[0])

  if (!donation) {
    return NextResponse.json(
      { error: "Donation not found for this session" },
      { status: 404 },
    )
  }

  if (donation.paymentStatus === "paid") {
    return NextResponse.json({ donation })
  }

  const [updated] = await db
    .update(donations)
    .set({ paymentStatus: "paid" })
    .where(eq(donations.id, donation.id))
    .returning()

  return NextResponse.json({ donation: updated })
})
