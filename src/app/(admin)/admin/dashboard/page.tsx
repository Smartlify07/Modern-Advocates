"use client"

import { Button } from "@/shared/ui/button"
import { CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { KpiCards } from "@/features/admin/components/kpi-cards"
import { UserTable } from "@/features/admin/components/user-table"
import { useUsers, useSuspendUser, useActivateUser, useDeleteUser } from "@/features/admin/users/hooks/use-users"
import type { User as UserType } from "@/features/admin/users/types"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"

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
