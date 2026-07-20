export interface Product {
  id: string
  name: string
  imageUrl: string | null
  salesPrice: number
  status: "draft" | "published" | "archived"
  sales: number
  revenue: number
}

export interface SaleTransaction {
  id: string
  productId: string
  product: string
  customerName: string
  customerEmail: string
  date: string
  amount: number
  currency: string
  paymentStatus: string
}

export interface SalesSummary {
  totalSales: number
  totalVolume: number
}

export interface Customer {
  id: string
  name: string
  email: string
  totalSpent: number
  courseCount: number
  lastPurchase: string | null
}

export interface ChartDataPoint {
  date: string
  sales: number
  revenue: number
}

export const dateOptions = ["Last 7 Days", "This Week", "This Month", "Last Month", "Last 90 Days"]

export function periodFromDateOption(option: string): string {
  switch (option) {
    case "Last 7 Days": return "7d"
    case "This Week": return "this-week"
    case "This Month": return "this-month"
    case "Last Month": return "last-month"
    case "Last 90 Days": return "90d"
    default: return "7d"
  }
}
