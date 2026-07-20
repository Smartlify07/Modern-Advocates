import { NextRequest, NextResponse } from "next/server"
import { eq, desc, and, sql } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, courses } from "@/infrastructure/database/schema/course"
import { user } from "@/infrastructure/database/schema/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

function buildDateCondition(period: string) {
  switch (period) {
    case "this-week":
      return sql`${orders.createdAt} >= DATE_TRUNC('week', NOW()) AND ${orders.createdAt} < DATE_TRUNC('week', NOW()) + INTERVAL '7 days'`
    case "this-month":
      return sql`${orders.createdAt} >= DATE_TRUNC('month', NOW()) AND ${orders.createdAt} < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'`
    case "last-month":
      return sql`${orders.createdAt} >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') AND ${orders.createdAt} < DATE_TRUNC('month', NOW())`
    case "90d":
      return sql`${orders.createdAt} >= NOW() - INTERVAL '90 days'`
    default:
      return sql`${orders.createdAt} >= NOW() - INTERVAL '7 days'`
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") ?? "7d"

    const conditions = [eq(orders.paymentStatus, "paid"), buildDateCondition(period)]

    const salesList = await db
      .select({
        id: orders.id,
        productId: orders.courseId,
        product: courses.title,
        customerName: user.name,
        customerEmail: user.email,
        date: orders.createdAt,
        amount: orders.amount,
        currency: orders.currency,
        paymentStatus: orders.paymentStatus,
      })
      .from(orders)
      .leftJoin(courses, eq(orders.courseId, courses.id))
      .leftJoin(user, eq(orders.studentId, user.id))
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt))

    const summaryResult = await db
      .select({
        totalSales: sql<number>`COALESCE(COUNT(*), 0)`,
        totalVolume: sql<number>`COALESCE(SUM(${orders.amount}), 0)`,
      })
      .from(orders)
      .where(and(...conditions))

    const summary = summaryResult[0]

    return NextResponse.json({
      sales: salesList,
      summary: {
        totalSales: Number(summary.totalSales),
        totalVolume: Number(summary.totalVolume),
      },
    })
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
