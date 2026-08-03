"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { CardTitle } from "@/shared/ui/card"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { PageHeader } from "@/shared/ui/page-header"
import { TableSkeleton } from "@/shared/ui/table-skeleton"
import { KpiCards } from "@/features/admin/components/kpi-cards"
import { UserTable } from "@/features/admin/components/user-table"
import { SuspendUserDialog } from "@/features/admin/users/components/suspend-user-dialog"
import { ActivateUserDialog } from "@/features/admin/users/components/activate-user-dialog"
import { DeleteUserDialog } from "@/features/admin/users/components/delete-user-dialog"
import { useUsers, useSuspendUser, useActivateUser, useDeleteUser } from "@/features/admin/users/hooks/use-users"
import type { User as UserType } from "@/features/admin/users/types"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { useSession } from "@/shared/hooks/use-session"
import {
  ErrorState,
  ErrorStateTitle,
  ErrorStateAction,
} from "@/shared/ui/error-state"

export default function AdminDashboardPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const role = session?.user?.role
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  const { data, isLoading, isError, error, refetch } = useUsers({ page: 1, pageSize: 5 })

  const suspendMutation = useSuspendUser()
  const activateMutation = useActivateUser()
  const deleteMutation = useDeleteUser()

  const handleSuspend = useCallback((user: UserType) => {
    setSelectedUser(user)
    setSuspendOpen(true)
  }, [])

  const handleActivate = useCallback((user: UserType) => {
    setSelectedUser(user)
    setActivateOpen(true)
  }, [])

  const handleDelete = useCallback((user: UserType) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }, [])

  return (
    <AdminPageContainer>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <PageHeader title="Dashboard" />
        </div>

        <KpiCards role={role} />
      </div>

      <div className="flex flex-col gap-8">
        <CardTitle className="text-2xl/[24px] font-bold">User List</CardTitle>
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
          <UserTable
            users={data?.users ?? []}
            onSuspend={handleSuspend}
            onActivate={handleActivate}
            onDelete={handleDelete}
            userRole={role}
          />
        )}
      </div>

      <SuspendUserDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        user={selectedUser}
        onConfirm={(u) =>
          suspendMutation.mutateAsync(u.id).then(() => setSuspendOpen(false)).catch(() => { toast.error("Failed to suspend user"); setSuspendOpen(false) })
        }
        isPending={suspendMutation.isPending}
      />

      <ActivateUserDialog
        open={activateOpen}
        onOpenChange={setActivateOpen}
        user={selectedUser}
        onConfirm={(u) =>
          activateMutation.mutateAsync(u.id).then(() => setActivateOpen(false)).catch(() => { toast.error("Failed to activate user"); setActivateOpen(false) })
        }
        isPending={activateMutation.isPending}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onConfirm={(u) =>
          deleteMutation.mutateAsync(u.id).then(() => setDeleteOpen(false)).catch(() => { toast.error("Failed to delete user"); setDeleteOpen(false) })
        }
        isPending={deleteMutation.isPending}
      />
    </AdminPageContainer>
  )
}
