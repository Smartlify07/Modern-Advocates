"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/features/admin/products/components/page-header"
import { SearchExportRow } from "@/features/admin/products/components/search-export-row"
import { CustomersTable } from "@/features/admin/products/components/customers-table"
import { PaginationBar } from "@/features/admin/products/components/pagination-bar"
import type { Customer } from "@/features/admin/products/components/customers-table"

const sampleCustomers: Customer[] = [
  { id: "c1", name: "John Doe", email: "john@example.com" },
  { id: "c2", name: "Jane Smith", email: "jane@example.com" },
  { id: "c3", name: "Bob Wilson", email: "bob@example.com" },
  { id: "c4", name: "Alice Brown", email: "alice@example.com" },
]

const PAGE_SIZE = 10

export default function AllCustomersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => sampleCustomers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <PageHeader title="All Customers" />
      <SearchExportRow placeholder="Search customer..." value={search} onChange={setSearch} />
      <div className="flex flex-col gap-8">
        <CustomersTable customers={filtered} />
        <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  )
}
