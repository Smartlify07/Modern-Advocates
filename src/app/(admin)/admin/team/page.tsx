"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { TeamTable } from "@/features/admin/team/components/team-table"
import { TeamFilterBar } from "@/features/admin/team/components/team-filter-bar"
import { TableSkeleton } from "@/features/admin/team/components/table-skeleton"
import { AddMemberDialog } from "@/features/admin/team/components/add-member-dialog"
import { EditPermissionDialog } from "@/features/admin/team/components/edit-permission-dialog"
import { PaginationBar } from "@/features/admin/team/components/pagination-bar"
import type { TeamMember } from "@/features/admin/team/types"
import { mockMembers } from "@/features/admin/team/types"

const PAGE_SIZE = 10

export default function AdminTeamsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const { data: members = mockMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["admin-team"],
    queryFn: () => fetch("/api/admin/team").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const filtered = useMemo(() => {
    let result = members
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    }
    if (typeFilter !== "all") result = result.filter((m) => m.role === typeFilter)
    return result
  }, [members, search, typeFilter])

  if (page > Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))) setPage(1)

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <TeamFilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        typeFilter={typeFilter}
        onTypeFilterChange={(v) => { setTypeFilter(v); setPage(1) }}
        onAddMember={() => setAddDialogOpen(true)}
      />

      <div className="flex flex-col gap-8">
        {isLoading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20">
            <p className="text-lg font-medium">
              {members.length === 0 ? "No team members yet" : "No team members found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {members.length === 0
                ? "Team members will appear here once added."
                : "There are no team members matching your criteria."}
            </p>
          </div>
        ) : (
          <>
            <TeamTable
              members={paginated}
              onEdit={(m) => { setSelectedMember(m); setEditDialogOpen(true) }}
            />
            <PaginationBar page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>

      <AddMemberDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditPermissionDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} member={selectedMember} />
    </div>
  )
}
