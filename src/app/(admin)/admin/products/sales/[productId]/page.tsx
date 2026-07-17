"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { SalesSummaryCards } from "@/features/admin/products/components/sales-summary-cards"
import { SalesTransactionsTable } from "@/features/admin/products/components/sales-transactions-table"
import { PaginationBar } from "@/features/admin/products/components/pagination-bar"
import { sampleProducts } from "@/features/admin/products/types"
import type { SaleTransaction } from "@/features/admin/products/components/sales-transactions-table"

const productSales: Record<string, SaleTransaction[]> = {
  "1": [
    { id: "s1", productId: "1", product: "Criminal Law Fundamentals", customerName: "John Doe", customerEmail: "john@example.com", date: "7/7/2026", amount: 49.99 },
    { id: "s2", productId: "1", product: "Criminal Law Fundamentals", customerName: "Jane Smith", customerEmail: "jane@example.com", date: "7/6/2026", amount: 49.99 },
  ],
}

const PAGE_SIZE = 10

export default function ProductSalesPage() {
  const { productId } = useParams<{ productId: string }>()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const product = sampleProducts.find((p) => p.id === productId)
  const sales = productSales[productId] ?? []

  const filtered = useMemo(
    () => sales.filter((s) => s.customerName.toLowerCase().includes(search.toLowerCase())),
    [search, sales],
  )

  const totalSales = sales.length
  const totalVolume = sales.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <PageHeader title={product?.name ?? "Product"} backHref="/admin/products/sales" />
      <SalesSummaryCards sales={totalSales} volume={totalVolume} />
      <SearchExportRow placeholder="Search sales..." value={search} onChange={setSearch} />
      <div className="flex flex-col gap-8">
        <SalesTransactionsTable sales={filtered} />
        <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  )
}
