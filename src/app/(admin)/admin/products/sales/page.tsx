"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"
import { PaginationBar } from "@/features/admin/products/components/pagination-bar"
import type { SaleTransaction } from "@/features/admin/products/components/sales-transactions-table"

const sampleSales: SaleTransaction[] = [
  { id: "s1", productId: "1", product: "Criminal Law Fundamentals", customerName: "John Doe", customerEmail: "john@example.com", date: "7/7/2026", amount: 49.99 },
  { id: "s2", productId: "2", product: "Constitutional Law Masterclass", customerName: "Jane Smith", customerEmail: "jane@example.com", date: "7/6/2026", amount: 79.99 },
  { id: "s3", productId: "3", product: "Family Law Practice Guide", customerName: "Bob Wilson", customerEmail: "bob@example.com", date: "7/5/2026", amount: 39.99 },
]

const PAGE_SIZE = 10

export default function AllSalesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => sampleSales.filter((s) => s.customerName.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <PageHeader title="All Sales" />
      <SalesSummaryCards sales={100} volume={10000} />
      <SearchExportRow placeholder="Search sales..." value={search} onChange={setSearch} />
      <div className="flex flex-col gap-8">
        <SalesTransactionsTable
          sales={filtered}
          showProduct
          getRowHref={(s) => `/admin/products/sales/${s.productId}`}
        />
        <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  )
}
