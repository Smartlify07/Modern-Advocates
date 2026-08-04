import { NextResponse } from "next/server"
import { eq, desc } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, courses } from "@/infrastructure/database/schema/course"
import { user } from "@/infrastructure/database/schema/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async () => {
  await requireAdmin()

  const transactions = await db
    .select({
      id: orders.id,
      amount: orders.amount,
      currency: orders.currency,
      paymentStatus: orders.paymentStatus,
      paymentProvider: orders.paymentProvider,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      source: orders.source,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      course: {
        id: courses.id,
        title: courses.title,
      },
    })
    .from(orders)
    .leftJoin(user, eq(orders.studentId, user.id))
    .leftJoin(courses, eq(orders.courseId, courses.id))
    .orderBy(desc(orders.createdAt))

  return NextResponse.json(transactions)
})
