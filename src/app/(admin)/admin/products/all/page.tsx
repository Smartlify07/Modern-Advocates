"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { AllProductsTable } from "@/features/admin/products/components/all-products-table"
import { PaginationBar } from "@/features/admin/products/components/pagination-bar"
import { sampleProducts } from "@/features/admin/products/types"

const PAGE_SIZE = 10

export default function AllProductsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => sampleProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <PageHeader title="All Products" />
      <SearchExportRow placeholder="Search product..." value={search} onChange={setSearch} />
      <div className="flex flex-col gap-8">
        <AllProductsTable products={filtered} />
        <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  )
}
