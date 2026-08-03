"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { PageHeader } from "@/shared/ui/page-header"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { CustomersTable } from "@/features/admin/products/components/customers-table"
import { PaginationBar } from "@/shared/ui/pagination-bar"
import { SearchExportSkeleton, TableSkeleton } from "@/features/admin/products/components/products-skeleton"
import type { Customer } from "@/features/admin/products/types"

const PAGE_SIZE = 10

export default function AllCustomersPage() {
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: queryKeys.admin.customers,
    queryFn: () => apiFetch<Customer[]>("/api/admin/customers"),
  })

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => customers.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) ?? false),
    [search, customers],
  )

  return (
    <AdminPageContainer>
      <PageHeader title="All Customers" />
      {isLoading ? (
        <>
          <SearchExportSkeleton />
          <TableSkeleton rows={5} cols={5} />
        </>
      ) : (
        <>
          <SearchExportRow placeholder="Search customer..." value={search} onChange={setSearch} />
          <div className="flex flex-col gap-8">
            <CustomersTable customers={filtered} />
            <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </>
      )}
    </AdminPageContainer>
  )
}
