"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { useParams } from "next/navigation"
import { PageHeader } from "@/shared/ui/page-header"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"
import { SalesSummarySkeleton } from "@/features/admin/products/components/products-skeleton"
import { TableSkeleton } from "@/shared/ui/table-skeleton"

interface SaleDetailItem {
  id: string
  customer: { id: string; name: string; email: string } | null
  date: string
  amount: number | string
}

interface SaleDetailResponse {
  product: { id: string; title: string }
  sales: SaleDetailItem[]
  totalSales: number
  totalRevenue: number
}

export default function SaleDetailPage() {
  const params = useParams()
  const productId = params.productId as string

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.saleDetail(productId),
    queryFn: async () => {
      try {
        return await apiFetch<SaleDetailResponse>(`/api/admin/sales/${productId}`)
      } catch {
        return null
      }
    },
    enabled: !!productId,
  })

  if (isLoading) {
    return (
      <AdminPageContainer>
        <PageHeader title="Sale Details" backHref="/admin/products/sales" />
        <SalesSummarySkeleton />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-52 rounded bg-muted animate-pulse" />
          <TableSkeleton
            columns={[
              { label: "Customer name", headClassName: "w-[200px]", skeletonClassName: "w-32" },
              { label: "Customer email", headClassName: "w-[240px]", skeletonClassName: "w-40" },
              { label: "Date", headClassName: "w-[160px]", skeletonClassName: "w-24" },
              { label: "Amount", headClassName: "w-[120px]", skeletonClassName: "w-16" },
            ]}
          />
        </div>
      </AdminPageContainer>
    )
  }

  if (!data) {
    return (
      <AdminPageContainer>
        <PageHeader title="Sale Details" backHref="/admin/products/sales" />
        <p className="text-muted-foreground">Product not found</p>
      </AdminPageContainer>
    )
  }

  const sales = data.sales.map((s) => ({
    id: s.id,
    productId,
    product: data.product.title,
    customerName: s.customer?.name ?? "—",
    customerEmail: s.customer?.email ?? "—",
    date: s.date,
    amount: Number(s.amount),
  }))

  return (
    <AdminPageContainer>
      <PageHeader title={data.product.title} backHref="/admin/products/sales" />
      <SalesSummaryCards sales={data.totalSales} volume={data.totalRevenue} />
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Customers who purchased</h2>
        <SalesTransactionsTable sales={sales} />
      </div>
    </AdminPageContainer>
  )
}
