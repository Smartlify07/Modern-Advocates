"use client"

import { Button } from "@/shared/ui/button"
import { CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { KpiCards } from "@/features/admin/components/kpi-cards"
import { UserTable } from "@/features/admin/components/user-table"
import { useUsers, useSuspendUser, useActivateUser, useDeleteUser } from "@/features/admin/users/hooks/use-users"
import type { User as UserType } from "@/features/admin/users/types"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-60" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
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

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useUsers({ page: 1, pageSize: 5 })

  const suspendMutation = useSuspendUser()
  const activateMutation = useActivateUser()
  const deleteMutation = useDeleteUser()

  const handleSuspend = (user: UserType) => suspendMutation.mutate(user.id)
  const handleActivate = (user: UserType) => activateMutation.mutate(user.id)
  const handleDelete = (user: UserType) => deleteMutation.mutate(user.id)

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl/[100%] font-semibold tracking-[-3%]">
            Dashboard
          </h1>
        </div>

        <KpiCards />
      </div>

      <div className="flex flex-col gap-8">
        <CardTitle className="text-2xl/[24px] font-bold">User List</CardTitle>
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState
            message={error?.message ?? "Failed to load users"}
            onRetry={() => refetch()}
          />
        ) : (
          <UserTable
            users={data?.users ?? []}
            onSuspend={handleSuspend}
            onActivate={handleActivate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
