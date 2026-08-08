import { NextResponse } from "next/server"
import { eq, sql, desc } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { courses, orders } from "@/infrastructure/database/schema/course"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { resolveStoredUrl } from "@/infrastructure/storage/service"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async () => {
  await requireAdmin()

  const raw = await db
    .select({
      id: courses.id,
      name: courses.title,
      imageUrl: courses.thumbnailUrl,
      thumbnailKey: courses.thumbnailKey,
      salesPrice: sql<string>`COALESCE(AVG(CASE WHEN ${orders.paymentStatus} = 'paid' THEN ${orders.amount} END), ${courses.price})`,
      status: courses.status,
      sales: sql<string>`COALESCE(COUNT(DISTINCT CASE WHEN ${orders.paymentStatus} = 'paid' THEN ${orders.id} END), 0)`,
      revenue: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'paid' THEN ${orders.amount} ELSE 0 END), 0)`,
    })
    .from(courses)
    .leftJoin(orders, eq(courses.id, orders.courseId))
    .groupBy(courses.id, courses.thumbnailUrl, courses.thumbnailKey)
    .orderBy(desc(courses.createdAt))

  const products = await Promise.all(
    raw.map(async ({ thumbnailKey, ...p }) => ({
      ...p,
      imageUrl: await resolveStoredUrl(thumbnailKey, p.imageUrl),
      salesPrice: Number(p.salesPrice),
      sales: Number(p.sales),
      revenue: Number(p.revenue),
    })),
  )

  return NextResponse.json(products)
})
