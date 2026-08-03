import { NextRequest, NextResponse } from "next/server"
import { sql } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders } from "@/infrastructure/database/schema/course"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { buildDateCondition } from "../utils"
import { apiHandler } from "@/shared/lib/api-handler"

interface StatsRow {
  date: string
  sales: string
  revenue: string
}

export const GET = apiHandler(async (request: NextRequest) => {
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

  const chartData = (raw.rows as unknown as StatsRow[]).map((row) => ({
    date: row.date,
    sales: Number(row.sales),
    revenue: Number(row.revenue),
  }))

  return NextResponse.json(chartData)
})
