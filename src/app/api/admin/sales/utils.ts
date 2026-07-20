import { sql } from "drizzle-orm"
import { orders } from "@/infrastructure/database/schema/course"

export function buildDateCondition(period: string) {
  switch (period) {
    case "this-week":
      return sql`${orders.createdAt} >= DATE_TRUNC('week', NOW()) AND ${orders.createdAt} < DATE_TRUNC('week', NOW()) + INTERVAL '7 days'`
    case "this-month":
      return sql`${orders.createdAt} >= DATE_TRUNC('month', NOW()) AND ${orders.createdAt} < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'`
    case "last-month":
      return sql`${orders.createdAt} >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') AND ${orders.createdAt} < DATE_TRUNC('month', NOW())`
    case "90d":
      return sql`${orders.createdAt} >= NOW() - INTERVAL '90 days'`
    case "all":
      return sql`TRUE`
    default:
      return sql`${orders.createdAt} >= NOW() - INTERVAL '7 days'`
  }
}
