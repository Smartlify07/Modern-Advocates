"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { CustomersTable } from "@/features/admin/products/components/customers-table"
import { PaginationBar } from "@/features/admin/products/components/pagination-bar"
import { SearchExportSkeleton, TableSkeleton } from "@/features/admin/products/components/products-skeleton"
import type { Customer } from "@/features/admin/products/types"

const PAGE_SIZE = 10

export default function AllCustomersPage() {
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["admin-customers"],
    queryFn: async () => { const r = await fetch("/api/admin/customers"); if (!r.ok) throw new Error("Failed to fetch customers"); return r.json() },
  })

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => customers.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) ?? false),
    [search, customers],
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
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
    </div>
  )
}
