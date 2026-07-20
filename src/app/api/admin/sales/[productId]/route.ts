import { NextResponse } from "next/server"
import { eq, desc, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { orders, courses } from "@/infrastructure/database/schema/course"
import { user } from "@/infrastructure/database/schema/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await requireAdmin()
    const { productId } = await params

    const courseInfo = await db
      .select({
        id: courses.id,
        title: courses.title,
        price: courses.price,
        status: courses.status,
      })
      .from(courses)
      .where(eq(courses.id, productId))
      .limit(1)

    if (courseInfo.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const sales = await db
      .select({
        id: orders.id,
        amount: orders.amount,
        currency: orders.currency,
        paymentStatus: orders.paymentStatus,
        date: orders.createdAt,
        customer: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(orders)
      .leftJoin(user, eq(orders.studentId, user.id))
      .where(
        and(eq(orders.courseId, productId), eq(orders.paymentStatus, "paid"))
      )
      .orderBy(desc(orders.createdAt))

    return NextResponse.json({
      product: courseInfo[0],
      sales,
      totalRevenue: sales.reduce((sum, s) => sum + Number(s.amount), 0),
      totalSales: sales.length,
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
