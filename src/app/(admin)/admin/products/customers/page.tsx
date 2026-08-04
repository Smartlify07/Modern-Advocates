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
import { CustomersTable } from "@/features/admin/products/components/customers-table"
import { PaginationBar } from "@/shared/ui/pagination-bar"
import { DataTableSkeleton } from "@/shared/ui/data-table-skeleton"
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

  const handleExport = () => {
    downloadCsv(
      "customers.csv",
      ["Name", "Email", "Courses Purchased", "Total Spent", "Last Purchase"],
      customers.map((c) => [c.name, c.email, c.courseCount, c.totalSpent, c.lastPurchase]),
    )
    toast.success(`Exported ${customers.length} customer${customers.length === 1 ? "" : "s"}`)
  }

  return (
    <AdminPageContainer>
      <PageHeader title="All Customers" backHref="/admin/products" />
      {isLoading ? (
        <DataTableSkeleton
          columns={[
            { label: "Customer name", headClassName: "w-[280px]", skeletonClassName: "w-48" },
            { label: "Customer email", headClassName: "w-[320px]", skeletonClassName: "w-56" },
            { label: "Courses Purchased", headClassName: "text-center", center: true, skeletonClassName: "w-12" },
            { label: "Total Spent", headClassName: "text-center", center: true, skeletonClassName: "w-16" },
            { label: "Last Purchase", headClassName: "text-center", center: true, skeletonClassName: "w-24" },
          ]}
        />
      ) : (
        <>
          <SearchExportRow placeholder="Search customer..." value={search} onChange={setSearch} onExport={handleExport} exportDisabled={customers.length === 0} />
          <div className="flex flex-col gap-8">
            <CustomersTable customers={filtered} />
            <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </>
      )}
    </AdminPageContainer>
  )
}
