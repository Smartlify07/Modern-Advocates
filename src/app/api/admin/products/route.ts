import { NextResponse } from "next/server"
import { eq, sql, desc, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { courses, orders } from "@/infrastructure/database/schema/course"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    await requireAdmin()

    const raw = await db
      .select({
        id: courses.id,
        name: courses.title,
        imageUrl: courses.thumbnailUrl,
        salesPrice: courses.price,
        status: courses.status,
        sales: sql<string>`COALESCE(COUNT(DISTINCT CASE WHEN ${orders.paymentStatus} = 'paid' THEN ${orders.id} END), 0)`,
        revenue: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'paid' THEN ${orders.amount} ELSE 0 END), 0)`,
      })
      .from(courses)
      .leftJoin(orders, eq(courses.id, orders.courseId))
      .groupBy(courses.id)
      .orderBy(desc(courses.createdAt))

    const products = raw.map((p) => ({
      ...p,
      sales: Number(p.sales),
      revenue: Number(p.revenue),
    }))

    return NextResponse.json(products)
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
