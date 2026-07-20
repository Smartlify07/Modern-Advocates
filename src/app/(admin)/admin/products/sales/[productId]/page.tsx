"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"
import { SalesSummarySkeleton, TableSkeleton } from "@/features/admin/products/components/products-skeleton"

interface SaleDetailItem {
  id: string
  customer: { id: string; name: string; email: string } | null
  date: string
  amount: number | string
}

export default function SaleDetailPage() {
  const params = useParams()
  const productId = params.productId as string

  const { data, isLoading } = useQuery({
    queryKey: ["admin-sale-detail", productId],
    queryFn: async () => {
      const r = await fetch(`/api/admin/sales/${productId}`)
      if (!r.ok) return null
      return r.json()
    },
    enabled: !!productId,
  })

  if (isLoading) {
    return (
      <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
        <PageHeader title="Sale Details" />
        <SalesSummarySkeleton />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-52 rounded bg-muted animate-pulse" />
          <TableSkeleton rows={5} cols={4} />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
        <PageHeader title="Sale Details" />
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  const sales = (data.sales as SaleDetailItem[]).map((s) => ({
    id: s.id,
    productId,
    product: data.product.title,
    customerName: s.customer?.name ?? "—",
    customerEmail: s.customer?.email ?? "—",
    date: s.date,
    amount: Number(s.amount),
  }))

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <PageHeader title={data.product.title} />
      <SalesSummaryCards sales={data.totalSales} volume={data.totalRevenue} />
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Customers who purchased</h2>
        <SalesTransactionsTable sales={sales} />
      </div>
    </div>
  )
}
