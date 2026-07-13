import { eq } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import { orders, enrollments } from "@/infrastructure/database/schema/course"
import * as Sentry from "@sentry/nextjs"

export interface OrderResult {
  order: typeof orders.$inferSelect
  enrollment: typeof enrollments.$inferSelect | null
}

export async function completeOrder(orderId: string): Promise<OrderResult> {
  let order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0])

  if (!order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  if (order.paymentStatus === "paid") {
    const existing = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.orderId, orderId))
      .then((r) => r[0] ?? null)

    if (existing) {
      return { order, enrollment: existing }
    }
  } else {
    const [updated] = await db
      .update(orders)
      .set({ paymentStatus: "paid" })
      .where(eq(orders.id, orderId))
      .returning()

    if (!updated) {
      throw new Error(`Failed to update order: ${orderId}`)
    }

    order = updated
  }

  let enrollment: typeof enrollments.$inferSelect | null = null
  try {
    const [enr] = await db
      .insert(enrollments)
      .values({
        orderId,
        studentId: order.studentId,
        courseId: order.courseId,
        status: "active",
      })
      .onConflictDoNothing()
      .returning()
    enrollment = enr ?? null
  } catch (err) {
    Sentry.captureException(err, {
      extra: { orderId, context: "enrollment creation after payment" },
    })
  }

  if (!enrollment) {
    enrollment = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.orderId, orderId))
      .then((r) => r[0] ?? null)
  }

  return { order, enrollment }
}
