import { NextResponse } from "next/server"
import { eq, desc, sql, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, courses, enrollments } from "@/infrastructure/database/schema/course"
import { user } from "@/infrastructure/database/schema/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    await requireAdmin()

    const raw = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        totalSpent: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'paid' THEN ${orders.amount} ELSE 0 END), 0)`,
        courseCount: sql<string>`CAST(COUNT(DISTINCT ${orders.courseId}) AS TEXT)`,
        lastPurchase: sql<string | null>`MAX(${orders.createdAt})`,
      })
      .from(user)
      .innerJoin(orders, eq(user.id, orders.studentId))
      .where(eq(orders.paymentStatus, "paid"))
      .groupBy(user.id)
      .orderBy(desc(sql`MAX(${orders.createdAt})`))

    const customers = raw.map((c) => ({
      ...c,
      totalSpent: Number(c.totalSpent),
      courseCount: Number(c.courseCount),
    }))

    return NextResponse.json(customers)
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
