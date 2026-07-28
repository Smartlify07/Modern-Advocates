import { NextRequest, NextResponse } from "next/server"
import { validateInviteToken } from "@/features/admin/team/services/team-service"
import * as Sentry from "@sentry/nextjs"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")
    if (!token?.trim()) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const result = await validateInviteToken(token.trim())
    return NextResponse.json(result)
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}