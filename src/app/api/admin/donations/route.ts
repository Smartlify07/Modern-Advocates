import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import { donations } from "@/infrastructure/database/schema/donation"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    await requireAdmin()
    const result = await db
      .select()
      .from(donations)
      .orderBy(desc(donations.createdAt))
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
