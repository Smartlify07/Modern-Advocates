import { NextResponse } from "next/server"
import { declineInvite } from "@/features/admin/team/services/team-service"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    if (!token?.trim()) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const result = await declineInvite(token.trim())
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
