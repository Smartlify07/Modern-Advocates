"use client"

import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiFetch } from "@/shared/lib/api-fetch"
import { TeamTable } from "@/features/admin/team/components/team-table"
import { TeamFilterBar } from "@/features/admin/team/components/team-filter-bar"
import { AddMemberDialog } from "@/features/admin/team/components/add-member-dialog"
import { EditPermissionDialog } from "@/features/admin/team/components/edit-permission-dialog"
import { PaginationBar } from "@/features/admin/team/components/pagination-bar"
import type { TeamMember } from "@/features/admin/team/types"
import { authClient } from "@/infrastructure/auth/client"

const PAGE_SIZE = 10

interface ListTeamMembersResponse {
  members: TeamMember[]
  total: number
  page: number
  pageSize: number
}

export default function AdminTeamsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const role = session?.user?.role
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const queryClient = useQueryClient()

  const cancelInviteMutation = useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      await apiFetch(`/api/admin/team/${id}/cancel`, { method: "POST" })
      return { email }
    },
    onSuccess: (_data, variables) => {
      setPage(1)
      queryClient.invalidateQueries({ queryKey: ["admin-team"] })
      toast.success(`Invitation for ${variables.email} has been cancelled`)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleCancelInvite = useCallback((member: TeamMember) => {
    cancelInviteMutation.mutate({ id: member.id, email: member.email })
  }, [cancelInviteMutation])

  const { data, isLoading } = useQuery<ListTeamMembersResponse>({
    queryKey: ["admin-team", search, typeFilter, page],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (typeFilter !== "all") params.set("role", typeFilter)
      params.set("page", String(page))
      params.set("pageSize", String(PAGE_SIZE))
      return apiFetch<ListTeamMembersResponse>(`/api/admin/team?${params}`)
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
        role={role}
      />

      <div className="flex flex-col gap-8">
        <TeamTable
          members={members}
          onEdit={(m) => { setSelectedMember(m); setEditDialogOpen(true) }}
          onCancelInvite={handleCancelInvite}
          isLoading={isLoading}
          total={total}
          role={role}
        />
        {!isLoading && members.length > 0 && (
          <PaginationBar page={page} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </div>

      <AddMemberDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditPermissionDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} member={selectedMember} />
    </div>
  )
}
