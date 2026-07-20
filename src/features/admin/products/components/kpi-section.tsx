import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/features/admin/components/stat-card"
import { ShoppingBag, TrendingUp, Users } from "lucide-react"
import type { Customer } from "@/features/admin/products/types"

export function KpiSection({
  totalProducts,
  totalSales,
}: {
  totalProducts: number
  totalSales: number
}) {
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["admin-customers"],
    queryFn: () => fetch("/api/admin/customers").then((r) => r.json()),
  })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="All Products"
        value={totalProducts}
        icon={ShoppingBag}
        change=""
        href="/admin/products/all"
      />
      <StatCard
        title="All Sales"
        value={totalSales}
        icon={TrendingUp}
        change=""
        href="/admin/products/sales"
      />
      <StatCard
        title="All Customers"
        value={customers.length}
        icon={Users}
        change=""
        href="/admin/products/customers"
      />
    </div>
  )
}
