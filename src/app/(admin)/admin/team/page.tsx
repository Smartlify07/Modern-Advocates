"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { TeamTable } from "@/features/admin/team/components/team-table"
import { TeamFilterBar } from "@/features/admin/team/components/team-filter-bar"
import { TableSkeleton } from "@/features/admin/team/components/table-skeleton"
import { AddMemberDialog } from "@/features/admin/team/components/add-member-dialog"
import { EditPermissionDialog } from "@/features/admin/team/components/edit-permission-dialog"
import { PaginationBar } from "@/features/admin/team/components/pagination-bar"
import type { TeamMember } from "@/features/admin/team/types"

const PAGE_SIZE = 10

interface ListTeamMembersResponse {
  members: TeamMember[]
  total: number
  page: number
  pageSize: number
}

export default function AdminTeamsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const { data, isLoading } = useQuery<ListTeamMembersResponse>({
    queryKey: ["admin-team", search, typeFilter, page],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (typeFilter !== "all") params.set("role", typeFilter)
      params.set("page", String(page))
      params.set("pageSize", String(PAGE_SIZE))
      return fetch(`/api/admin/team?${params}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch team members")
        return r.json()
      })
    },
    refetchOnWindowFocus: false,
  })

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v)
    setPage(1)
  }, [])

  const handleTypeFilterChange = useCallback((v: string) => {
    setTypeFilter(v)
    setPage(1)
  }, [])

  const members = data?.members ?? []
  const total = data?.total ?? 0

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <TeamFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        onAddMember={() => setAddDialogOpen(true)}
      />

      <div className="flex flex-col gap-8">
        {isLoading ? (
          <TableSkeleton />
        ) : members.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20">
            <p className="text-lg font-medium">
              {total === 0 ? "No team members yet" : "No team members found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "Team members will appear here once added."
                : "There are no team members matching your criteria."}
            </p>
          </div>
        ) : (
          <>
            <TeamTable
              members={members}
              onEdit={(m) => { setSelectedMember(m); setEditDialogOpen(true) }}
            />
            <PaginationBar page={page} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>

      <AddMemberDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditPermissionDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} member={selectedMember} />
    </div>
  )
}
