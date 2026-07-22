import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { db } from "@/infrastructure/database/client"
import { contacts } from "@/infrastructure/database/schema/contact"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      )
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      )
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      )
    }

    const id = randomUUID()

    const [contact] = await db
      .insert(contacts)
      .values({
        id,
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        message: message.trim(),
      })
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
