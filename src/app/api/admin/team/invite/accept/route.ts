import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { acceptInvite } from "@/features/admin/team/services/team-service"
import { auth } from "@/infrastructure/auth/auth"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    if (!body.token?.trim()) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const result = await acceptInvite(body.token.trim(), session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
