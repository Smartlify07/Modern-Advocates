import { StatCard } from "@/features/admin/components/stat-card"
import { ShoppingBag, TrendingUp, Users } from "lucide-react"

export function KpiSection() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="All Products" value={4} icon={ShoppingBag} change="" href="/admin/products/all" />
      <StatCard title="All Sales" value={100} icon={TrendingUp} change="" href="/admin/products/sales" />
      <StatCard title="All Customers" value={40} icon={Users} change="" href="/admin/products/customers" />
    </div>
  )
}
