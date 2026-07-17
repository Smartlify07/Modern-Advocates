"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { UserTable } from "@/features/admin/components/user-table"
import { ControlsRow } from "@/features/admin/users/components/controls-row"
import { PaginationBar } from "@/features/admin/users/components/pagination-bar"
import { AddUserDialog } from "@/features/admin/users/components/add-user-dialog"
import { SuspendUserDialog } from "@/features/admin/users/components/suspend-user-dialog"
import { ActivateUserDialog } from "@/features/admin/users/components/activate-user-dialog"
import { DeleteUserDialog } from "@/features/admin/users/components/delete-user-dialog"
import { useUsers, useCreateUser, useSuspendUser, useActivateUser, useDeleteUser } from "@/features/admin/users/hooks/use-users"
import type { User } from "@/features/admin/users/types"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"

const PAGE_SIZE = 10

function TableSkeleton() {
  return (
    <Table>
      <TableHeader className="rounded-t-2xl">
        <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
          <TableHead className="w-[220px]">User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-center">Course Enrolled</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-44" /></TableCell>
            <TableCell className="text-center"><Skeleton className="mx-auto h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell className="text-center"><Skeleton className="mx-auto h-6 w-6 rounded-full" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 py-12">
      <AlertCircleIcon className="size-8 text-red-500" />
      <p className="text-sm text-red-600">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCwIcon className="size-4" />
        Try again
      </Button>
    </div>
  )
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const { data, isLoading, isError, error, refetch } = useUsers({ search, status: statusFilter, page, pageSize: PAGE_SIZE })
  const createUser = useCreateUser()
  const suspendUser = useSuspendUser()
  const activateUser = useActivateUser()
  const deleteUser = useDeleteUser()

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

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <ControlsRow
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onAddUser={() => setAddOpen(true)}
      />

      <div className="flex flex-col gap-8">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState
            message={error?.message ?? "Failed to load users"}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <UserTable
              users={data?.users ?? []}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
              onDelete={handleDelete}
            />
            {data && (
              <PaginationBar
                page={page}
                total={data.total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
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
    </div>
  )
}
