import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import { user } from "@/infrastructure/database/schema/auth"
import { courses, orders } from "@/infrastructure/database/schema/course"
import { donations } from "@/infrastructure/database/schema/donation"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

function calcChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%"
  const pct = ((current - previous) / previous) * 100
  const sign = pct >= 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}

export async function GET() {
  try {
    await requireAdmin()

    const [userCount] = await db
      .select({ count: sql<number>`COALESCE(COUNT(*), 0)` })
      .from(user)

    const [courseCount] = await db
      .select({ count: sql<number>`COALESCE(COUNT(*), 0)` })
      .from(courses)
      .where(sql`${courses.status} = 'published'`)

    const [donationTotal] = await db
      .select({ total: sql<number>`COALESCE(SUM(${donations.amount}), 0)` })
      .from(donations)
      .where(sql`${donations.paymentStatus} = 'paid'`)

    const [salesTotal] = await db
      .select({
        count: sql<number>`COALESCE(COUNT(*), 0)`,
        volume: sql<number>`COALESCE(SUM(${orders.amount}), 0)`,
      })
      .from(orders)
      .where(sql`${orders.paymentStatus} = 'paid'`)

    const users = Number(userCount.count)
    const totalCourses = Number(courseCount.count)
    const totalDonations = Number(donationTotal.total)
    const totalSales = Number(salesTotal.count)
    const totalRevenue = Number(salesTotal.volume)

    const userPrevious = await db
      .select({ count: sql<number>`COALESCE(COUNT(*), 0)` })
      .from(user)
      .where(sql`${user.createdAt} < NOW() - INTERVAL '30 days'`)

    const coursePrevious = await db
      .select({ count: sql<number>`COALESCE(COUNT(*), 0)` })
      .from(courses)
      .where(sql`${courses.status} = 'published' AND ${courses.createdAt} < NOW() - INTERVAL '30 days'`)

    const donationPrevious = await db
      .select({ total: sql<number>`COALESCE(SUM(${donations.amount}), 0)` })
      .from(donations)
      .where(sql`${donations.paymentStatus} = 'paid' AND ${donations.createdAt} < NOW() - INTERVAL '30 days'`)

    const salesPrevious = await db
      .select({ count: sql<number>`COALESCE(COUNT(*), 0)` })
      .from(orders)
      .where(sql`${orders.paymentStatus} = 'paid' AND ${orders.createdAt} < NOW() - INTERVAL '30 days'`)

    return NextResponse.json({
      users,
      courses: totalCourses,
      donations: totalDonations,
      sales: totalSales,
      revenue: totalRevenue,
      changes: {
        users: calcChange(users, Number(userPrevious[0].count)),
        courses: calcChange(totalCourses, Number(coursePrevious[0].count)),
        donations: calcChange(totalDonations, Number(donationPrevious[0].total)),
        sales: calcChange(totalSales, Number(salesPrevious[0].count)),
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
