import { NextResponse } from "next/server"
import { eq, desc, sql } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders } from "@/infrastructure/database/schema/course"
import { user } from "@/infrastructure/database/schema/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async () => {
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
})
