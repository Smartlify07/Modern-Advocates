"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"

export default function SaleDetailPage() {
  const params = useParams()
  const productId = params.productId as string

  const { data, isLoading } = useQuery({
    queryKey: ["admin-sale-detail", productId],
    queryFn: () => fetch(`/api/admin/sales/${productId}`).then((r) => r.json()),
    enabled: !!productId,
  })

  if (isLoading) {
    return (
      <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
        <PageHeader title="Loading..." />
        <p className="text-muted-foreground">Loading sale details...</p>
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

  const sales = data.sales.map((s: any) => ({
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
