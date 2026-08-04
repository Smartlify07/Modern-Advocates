"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { TableSkeleton } from "@/shared/ui/table-skeleton"
import { UserTable } from "@/features/admin/components/user-table"
import { ControlsRow } from "@/features/admin/users/components/controls-row"
import { PaginationBar } from "@/shared/ui/pagination-bar"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { AddUserDialog } from "@/features/admin/users/components/add-user-dialog"
import { SuspendUserDialog } from "@/features/admin/users/components/suspend-user-dialog"
import { ActivateUserDialog } from "@/features/admin/users/components/activate-user-dialog"
import { DeleteUserDialog } from "@/features/admin/users/components/delete-user-dialog"
import { useUsers, useCreateUser, useSuspendUser, useActivateUser, useDeleteUser } from "@/features/admin/users/hooks/use-users"
import type { User } from "@/features/admin/users/types"
import { downloadCsv } from "@/shared/utils"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { useSession } from "@/shared/hooks/use-session"
import {
  ErrorState,
  ErrorStateTitle,
  ErrorStateAction,
} from "@/shared/ui/error-state"

const PAGE_SIZE = 10

export default function AdminUsersPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const role = session?.user?.role
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const { data, isLoading, isError, error, refetch } = useUsers({ page: 1, pageSize: 10000 })
  const createUser = useCreateUser()
  const suspendUser = useSuspendUser()
  const activateUser = useActivateUser()
  const deleteUser = useDeleteUser()

  const allUsers = data?.users ?? []

  const filtered = useMemo(() => {
    let result = allUsers
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter)
    }
    return result
  }, [allUsers, search, statusFilter])

  const total = filtered.length

  if (page > Math.max(1, Math.ceil(total / PAGE_SIZE))) {
    setPage(1)
  }

  const paginatedUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSuspend = useCallback((user: User) => {
    setSelectedUser(user)
    setSuspendOpen(true)
  }, [])

  const handleActivate = useCallback((user: User) => {
    setSelectedUser(user)
    setActivateOpen(true)
  }, [])

  const handleDelete = useCallback((user: User) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
    setPage(1)
  }, [])

  const handleExport = useCallback(() => {
    downloadCsv(
      "users.csv",
      ["Name", "Email", "Courses Enrolled", "Status", "Last Login", "Created At"],
      allUsers.map((u) => [
        u.name,
        u.email,
        u.courseEnrolled,
        u.status,
        u.lastLogin,
        u.createdAt,
      ]),
    )
    toast.success(`Exported ${allUsers.length} user${allUsers.length === 1 ? "" : "s"}`)
  }, [allUsers])

  return (
    <AdminPageContainer>
      <ControlsRow
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onAddUser={() => setAddOpen(true)}
        onExport={handleExport}
        exportDisabled={allUsers.length === 0}
        role={sessionPending ? "loading" : role}
      />

      <div className="flex flex-col gap-8">
        {sessionPending || isLoading ? (
          <TableSkeleton
            columns={[
              { label: "User", headClassName: "w-[220px]" },
              { label: "Email", headClassName: "w-[280px]" },
              { label: "Course Enrolled", headClassName: "w-[140px] text-center", center: true, skeletonClassName: "w-12" },
              { label: "Status", headClassName: "w-[100px]", skeletonClassName: "w-16" },
              { label: "Last Login", headClassName: "w-[160px]", skeletonClassName: "w-24" },
              { label: "Actions", headClassName: "w-[80px] text-center", center: true, skeletonClassName: "size-6 rounded-full" },
            ]}
          />
        ) : isError ? (
          <ErrorState className="rounded-lg border border-red-200 bg-red-50 py-12">
            <AlertCircleIcon className="size-8 text-red-500" />
            <ErrorStateTitle className="text-sm font-normal text-red-600">
              {error?.message ?? "Failed to load users"}
            </ErrorStateTitle>
            <ErrorStateAction>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCwIcon className="size-4" />
                Try again
              </Button>
            </ErrorStateAction>
          </ErrorState>
        ) : (
          <>
            <UserTable
              users={paginatedUsers}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
              onDelete={handleDelete}
              userRole={role}
            />
            <PaginationBar
              page={page}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AddUserDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(d) =>
          createUser.mutateAsync(d).then(() => setAddOpen(false)).catch(() => { toast.error("Failed to create user"); setAddOpen(false) })
        }
        isPending={createUser.isPending}
      />

      <SuspendUserDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        user={selectedUser}
        onConfirm={(u) =>
          suspendUser.mutateAsync(u.id).then(() => setSuspendOpen(false)).catch(() => { toast.error("Failed to suspend user"); setSuspendOpen(false) })
        }
        isPending={suspendUser.isPending}
      />

      <ActivateUserDialog
        open={activateOpen}
        onOpenChange={setActivateOpen}
        user={selectedUser}
        onConfirm={(u) =>
          activateUser.mutateAsync(u.id).then(() => setActivateOpen(false)).catch(() => { toast.error("Failed to activate user"); setActivateOpen(false) })
        }
        isPending={activateUser.isPending}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onConfirm={(u) =>
          deleteUser.mutateAsync(u.id).then(() => setDeleteOpen(false)).catch(() => { toast.error("Failed to delete user"); setDeleteOpen(false) })
        }
        isPending={deleteUser.isPending}
      />
    </AdminPageContainer>
  )
}
