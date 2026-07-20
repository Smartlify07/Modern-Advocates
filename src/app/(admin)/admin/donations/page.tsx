"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"
import { DonationsTable } from "@/features/admin/donations/components/donations-table"
import { SearchExportRow } from "@/features/admin/donations/components/search-export-row"
import { PaginationBar } from "@/features/admin/donations/components/pagination-bar"
import type { Donation } from "@/features/admin/donations/types"

const ITEMS_PER_PAGE = 10

function TableSkeleton() {
  return (
    <Table>
      <TableHeader className="rounded-t-2xl">
        <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
          <TableHead className="w-[220px]">Name</TableHead>
          <TableHead className="w-[280px]">Email</TableHead>
          <TableHead className="w-[120px]">Amount</TableHead>
          <TableHead className="w-[160px]">Donation Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-44" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function AdminDonationsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)

  const { data: donations = [], isLoading } = useQuery<Donation[]>({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const res = await fetch("/api/admin/donations")
      if (!res.ok) throw new Error("Failed to fetch donations")
      return res.json() as Promise<Donation[]>
    },
    refetchOnWindowFocus: false,
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
    <div className="mx-auto flex flex-col gap-7.5 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <h1 className="text-4xl font-semibold tracking-[-3%]">Donations</h1>

      <SearchExportRow
        search={search}
        typeFilter={typeFilter}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        onTypeFilterChange={(v) => { setTypeFilter(v); setPage(1) }}
      />

      {isLoading ? (
        <TableSkeleton />
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
    </div>
  )
}
