"use client"

import { useState, useMemo } from "react"
import { Button } from "@/shared/ui/button"
import { KpiCards } from "@/features/admin/support/components/kpi-cards"
import { SupportFilterBar } from "@/features/admin/support/components/support-filter-bar"
import { SupportTable } from "@/features/admin/support/components/support-table"
import { PaginationBar } from "@/features/admin/support/components/pagination-bar"
import { TableSkeleton } from "@/features/admin/support/components/table-skeleton"
import { ViewTicketDialog } from "@/features/admin/support/components/view-ticket-dialog"
import { useSupportTickets, useUpdateTicketStatus, useDeleteTicket } from "@/features/admin/support/hooks/use-support"
import { RefreshCwIcon, AlertCircleIcon } from "lucide-react"
import type { Ticket } from "@/features/admin/support/types"

interface ApiTicket {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: "open" | "pending" | "resolved"
  createdAt: string
}

function mapTicket(t: ApiTicket): Ticket {
  const d = new Date(t.createdAt)
  const date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  return { id: t.id, name: t.name, email: t.email, phone: t.phone, message: t.message, status: t.status, date }
}

const PAGE_SIZE = 10

function TicketsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
        <AlertCircleIcon className="size-6 text-red-600" />
      </div>
      <p className="text-lg font-semibold">Failed to load tickets</p>
      <p className="text-sm text-muted-foreground">Something went wrong. Please try again.</p>
      <Button variant="outline" className="gap-2" onClick={onRetry}>
        <RefreshCwIcon className="size-4" />
        Try Again
      </Button>
    </div>
  )
}

export default function AdminSupportPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const { data, isLoading, isError, refetch } = useSupportTickets()
  const statusMutation = useUpdateTicketStatus()
  const deleteMutation = useDeleteTicket()

  const allTickets = useMemo(() => (data?.tickets ?? []).map(mapTicket), [data?.tickets])

  const filteredTickets = useMemo(() => {
    let result = allTickets
    if (filter !== "all") result = result.filter((t) => t.status === filter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.message.toLowerCase().includes(q),
      )
    }
    return result
  }, [allTickets, filter, search])

  const kpis = useMemo(() => {
    return {
      total: data?.total ?? 0,
      open: data?.open ?? 0,
      pending: data?.pending ?? 0,
      resolved: data?.resolved ?? 0,
    }
  }, [data?.total, data?.open, data?.pending, data?.resolved])

  const filteredTotal = filteredTickets.length
  const paginatedTickets = useMemo(
    () => filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredTickets, page],
  )

  const handleView = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setViewOpen(true)
  }

  const handleStatusChange = async (id: string, status: string) => {
    await statusMutation.mutateAsync({ id, status })
    setViewOpen(false)
    setSelectedTicket(null)
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

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
        onFilterChange={(v) => setFilter(v)}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <TicketsError onRetry={() => refetch()} />
      ) : (
        <>
          <SupportTable
            tickets={paginatedTickets}
            onView={handleView}
            onDelete={handleDelete}
          />
          {filteredTotal > 0 && (
            <PaginationBar
              page={page}
              total={filteredTotal}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ViewTicketDialog
        open={viewOpen}
        onOpenChange={(o) => {
          setViewOpen(o)
          if (!o) setSelectedTicket(null)
        }}
        ticket={selectedTicket}
        onStatusChange={handleStatusChange}
        isPending={statusMutation.isPending}
      />
    </div>
  )
}
