"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { downloadCsv } from "@/shared/utils"
import { PageHeader } from "@/shared/ui/page-header"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"
import { PaginationBar } from "@/shared/ui/pagination-bar"
import { SalesSummarySkeleton } from "@/features/admin/products/components/products-skeleton"
import { DataTableSkeleton } from "@/shared/ui/data-table-skeleton"
import type { SaleTransaction, SalesSummary } from "@/features/admin/products/types"

const PAGE_SIZE = 10

export default function AllSalesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery<{ sales: SaleTransaction[]; summary: SalesSummary }>({
    queryKey: queryKeys.admin.sales,
    queryFn: () => apiFetch<{ sales: SaleTransaction[]; summary: SalesSummary }>("/api/admin/sales?period=all"),
  })

  const sales = data?.sales ?? []
  const summary = data?.summary ?? { totalSales: 0, totalVolume: 0 }

  const filtered = useMemo(
    () => sales.filter((s) => s.customerName?.toLowerCase().includes(search.toLowerCase()) ?? false),
    [search, sales],
  )

  const handleExport = () => {
    downloadCsv(
      "sales.csv",
      ["Customer Name", "Customer Email", "Product", "Date", "Amount", "Payment Status"],
      sales.map((s) => [
        s.customerName,
        s.customerEmail,
        s.product,
        s.date,
        s.amount,
        s.paymentStatus,
      ]),
    )
    toast.success(`Exported ${sales.length} sale${sales.length === 1 ? "" : "s"}`)
  }

  return (
    <AdminPageContainer>
      <PageHeader title="All Sales" backHref="/admin/products" />
      {isLoading ? (
        <>
          <SalesSummarySkeleton />
          <DataTableSkeleton
            columns={[
              { label: "Product", headClassName: "w-[200px]", skeletonClassName: "w-32" },
              { label: "Customer name", headClassName: "w-[200px]", skeletonClassName: "w-32" },
              { label: "Customer email", headClassName: "w-[260px]", skeletonClassName: "w-44" },
              { label: "Transaction Date", headClassName: "w-[180px]", skeletonClassName: "w-28" },
              { label: "Amount", headClassName: "w-[120px]", skeletonClassName: "w-16" },
            ]}
          />
        </>
      ) : (
        <>
          <SalesSummaryCards sales={summary.totalSales} volume={summary.totalVolume} />
          <SearchExportRow placeholder="Search sales..." value={search} onChange={setSearch} onExport={handleExport} exportDisabled={sales.length === 0} />
          <div className="flex flex-col gap-8">
            <SalesTransactionsTable
              sales={filtered}
              showProduct
              getRowHref={(s) => `/admin/products/sales/${s.productId}`}
            />
            <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </>
      )}
    </AdminPageContainer>
  )
}
