import { NextRequest, NextResponse } from "next/server"
import { sql } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders } from "@/infrastructure/database/schema/course"
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
    const dateCondition = buildDateCondition(period)

    const raw = await db.execute(sql`
      SELECT
        DATE(${orders.createdAt}) as date,
        COALESCE(COUNT(*), 0) as sales,
        COALESCE(SUM(${orders.amount}), 0) as revenue
      FROM ${orders}
      WHERE ${orders.paymentStatus} = 'paid'
        AND ${dateCondition}
      GROUP BY DATE(${orders.createdAt})
      ORDER BY DATE(${orders.createdAt}) ASC
    `)

    const chartData = raw.rows.map((row: any) => ({
      date: row.date,
      sales: Number(row.sales),
      revenue: Number(row.revenue),
    }))

    return NextResponse.json(chartData)
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
