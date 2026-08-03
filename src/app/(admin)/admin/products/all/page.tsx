"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { PageHeader } from "@/shared/ui/page-header"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { AllProductsTable } from "@/features/admin/products/components/all-products-table"
import { PaginationBar } from "@/shared/ui/pagination-bar"
import { DataTableSkeleton } from "@/shared/ui/data-table-skeleton"
import type { Product } from "@/features/admin/products/types"

const PAGE_SIZE = 10

export default function AllProductsPage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: queryKeys.admin.products,
    queryFn: () => apiFetch<Product[]>(`/api/admin/products`),
  })

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [search, products],
  )

  return (
    <AdminPageContainer>
      <PageHeader title="All Products" />
      {isLoading ? (
        <DataTableSkeleton
          columns={[
            { label: "Product", headClassName: "w-[280px]", skeletonClassName: "w-48" },
            { label: "Sales Price", headClassName: "w-[120px] text-center", center: true, skeletonClassName: "w-20" },
            { label: "Status", headClassName: "w-[100px] text-center", center: true, skeletonClassName: "w-20" },
            { label: "Sales", headClassName: "w-[80px] text-center", center: true, skeletonClassName: "w-12" },
            { label: "Actions", headClassName: "w-[80px] text-center", center: true, skeletonClassName: "size-6 rounded-full" },
          ]}
        />
      ) : (
        <>
          <SearchExportRow placeholder="Search product..." value={search} onChange={setSearch} />
          <div className="flex flex-col gap-8">
            <AllProductsTable products={filtered} />
            <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </>
      )}
    </AdminPageContainer>
  )
}
