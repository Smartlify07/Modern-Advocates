"use client"

import { useState, useMemo } from "react"
import { KpiCards } from "@/features/admin/support/components/kpi-cards"
import { SupportFilterBar } from "@/features/admin/support/components/support-filter-bar"
import { SupportTable } from "@/features/admin/support/components/support-table"
import { PaginationBar } from "@/features/admin/support/components/pagination-bar"
import { TableSkeleton } from "@/features/admin/support/components/table-skeleton"

const PAGE_SIZE = 10

const mockTickets = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    message: "Help! I can't sign in to my account after the recent update.",
    status: "open" as const,
    date: "1/7/2026",
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "alice@example.com",
    message: "Course curriculum not loading properly on mobile devices.",
    status: "open" as const,
    date: "1/7/2026",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    message: "Payment issue with my monthly subscription plan.",
    status: "open" as const,
    date: "1/6/2026",
  },
  {
    id: "4",
    name: "Carol White",
    email: "carol@example.com",
    message: "Certificate download option is missing from dashboard.",
    status: "open" as const,
    date: "1/6/2026",
  },
  {
    id: "5",
    name: "David Lee",
    email: "david@example.com",
    message: "Unable to reset my password using the forgot password link.",
    status: "open" as const,
    date: "1/5/2026",
  },
  {
    id: "6",
    name: "Eva Martinez",
    email: "eva@example.com",
    message: "Video lectures are buffering despite good internet connection.",
    status: "open" as const,
    date: "1/5/2026",
  },
  {
    id: "7",
    name: "Frank Brown",
    email: "frank@example.com",
    message: "Refund request for course ID #2049 not processed yet.",
    status: "pending" as const,
    date: "1/4/2026",
  },
  {
    id: "8",
    name: "Grace Kim",
    email: "grace@example.com",
    message: "Account upgrade from basic to premium not reflecting.",
    status: "pending" as const,
    date: "1/4/2026",
  },
  {
    id: "9",
    name: "Henry Davis",
    email: "henry@example.com",
    message: "Quiz results not syncing after completion of module 3.",
    status: "resolved" as const,
    date: "1/3/2026",
  },
  {
    id: "10",
    name: "Ivy Chen",
    email: "ivy@example.com",
    message: "Notification emails not being delivered to my inbox.",
    status: "open" as const,
    date: "1/3/2026",
  },
  {
    id: "11",
    name: "Jack Wilson",
    email: "jack@example.com",
    message: "Progress tracking not updating after watching videos.",
    status: "open" as const,
    date: "1/2/2026",
  },
  {
    id: "12",
    name: "Karen Taylor",
    email: "karen@example.com",
    message: "Unable to access course materials after enrollment.",
    status: "open" as const,
    date: "1/2/2026",
  },
]

export default function AdminSupportPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [isLoading] = useState(false)

  const kpis = useMemo(() => {
    const total = mockTickets.length
    const open = mockTickets.filter((t) => t.status === "open").length
    const pending = mockTickets.filter((t) => t.status === "pending").length
    const resolved = mockTickets.filter((t) => t.status === "resolved").length
    return { total, open, pending, resolved }
  }, [])

  const filtered = useMemo(() => {
    let result = mockTickets
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.message.toLowerCase().includes(q)
      )
    }
    if (filter !== "all") {
      result = result.filter((t) => t.status === filter)
    }
    return result
  }, [search, filter])

  if (page > Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))) {
    setPage(1)
  }

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto flex flex-col gap-7.5 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <h1 className="text-4xl font-bold tracking-[-3%]">Help &amp; Support</h1>

      <KpiCards
        totalTickets={kpis.total}
        open={kpis.open}
        pending={kpis.pending}
        resolved={kpis.resolved}
      />

      <SupportFilterBar
        search={search}
        filter={filter}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        onFilterChange={(v) => {
          setFilter(v)
          setPage(1)
        }}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <SupportTable tickets={paginated} />
          {filtered.length > 0 && (
            <PaginationBar
              page={page}
              total={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
