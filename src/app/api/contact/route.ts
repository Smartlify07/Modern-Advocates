import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import { db } from "@/infrastructure/database/client"
import { contacts } from "@/infrastructure/database/schema/contact"
import * as Sentry from "@sentry/nextjs"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").transform((s) => s.trim()),
  email: z.string().email("Invalid email format").transform((s) => s.trim()),
  message: z.string().min(1, "Message is required").transform((s) => s.trim()),
  phone: z.string().optional().transform((s) => s?.trim() || null),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid request"
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { name, email, message, phone } = parsed.data
    const id = randomUUID()

    const [contact] = await db
      .insert(contacts)
      .values({ id, name, email, phone, message })
      .returning()

    if (!contact) {
      return NextResponse.json(
        { error: "Failed to submit contact form" },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: "Your message has been submitted successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    Sentry.captureException(error, { tags: { route: "api/contact" } })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
