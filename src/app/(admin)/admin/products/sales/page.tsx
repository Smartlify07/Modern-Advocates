"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"
import { PaginationBar } from "@/features/admin/products/components/pagination-bar"
import { SalesSummarySkeleton, SearchExportSkeleton, TableSkeleton } from "@/features/admin/products/components/products-skeleton"
import type { SaleTransaction, SalesSummary } from "@/features/admin/products/types"

const PAGE_SIZE = 10

export default function AllSalesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery<{ sales: SaleTransaction[]; summary: SalesSummary }>({
    queryKey: ["admin-sales"],
    queryFn: () => fetch("/api/admin/sales").then((r) => r.json()),
  })

  const sales = data?.sales ?? []
  const summary = data?.summary ?? { totalSales: 0, totalVolume: 0 }

  const filtered = useMemo(
    () => sales.filter((s) => s.customerName?.toLowerCase().includes(search.toLowerCase()) ?? false),
    [search, sales],
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <PageHeader title="All Sales" />
      {isLoading ? (
        <>
          <SalesSummarySkeleton />
          <SearchExportSkeleton />
          <TableSkeleton rows={5} cols={5} />
        </>
      ) : (
        <>
          <SalesSummaryCards sales={summary.totalSales} volume={summary.totalVolume} />
          <SearchExportRow placeholder="Search sales..." value={search} onChange={setSearch} />
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
    </div>
  )
}
