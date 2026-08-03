"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { TableSkeleton } from "@/shared/ui/table-skeleton"
import { DonationsTable } from "@/features/admin/donations/components/donations-table"
import { SearchExportRow } from "@/features/admin/donations/components/search-export-row"
import { PaginationBar } from "@/shared/ui/pagination-bar"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { PageHeader } from "@/shared/ui/page-header"
import type { Donation } from "@/features/admin/donations/types"

const ITEMS_PER_PAGE = 10

export default function AdminDonationsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)

  const { data: donations = [], isLoading } = useQuery<Donation[]>({
    queryKey: queryKeys.admin.donations,
    queryFn: () => apiFetch<Donation[]>("/api/admin/donations"),
  })

  const filtered = useMemo(() => {
    let result = donations
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.donorName.toLowerCase().includes(q) ||
          d.donorEmail.toLowerCase().includes(q),
      )
    }
    if (typeFilter !== "all") {
      result = result.filter((d) => d.donationType === typeFilter)
    }
    return result
  }, [donations, search, typeFilter])

  if (page > Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))) {
    setPage(1)
  }

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <AdminPageContainer className="gap-7.5">
      <PageHeader title="Donations" />

      <SearchExportRow
        search={search}
        typeFilter={typeFilter}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        onTypeFilterChange={(v) => { setTypeFilter(v); setPage(1) }}
      />

      {isLoading ? (
        <TableSkeleton
          columns={[
            { label: "Name", headClassName: "w-[220px]" },
            { label: "Email", headClassName: "w-[280px]" },
            { label: "Amount", headClassName: "w-[120px]", skeletonClassName: "w-20" },
            { label: "Donation Type", headClassName: "w-[160px]", skeletonClassName: "w-28" },
          ]}
        />
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20">
          {donations.length === 0 ? (
            <>
              <p className="text-lg font-medium">No donations yet</p>
              <p className="text-sm text-muted-foreground">Donations will appear here once supporters contribute.</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">No donations found</p>
              <p className="text-sm text-muted-foreground">There are no donations matching your criteria.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <DonationsTable donations={paginated} />
          <PaginationBar
            page={page}
            total={filtered.length}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      )}
    </AdminPageContainer>
  )
}
