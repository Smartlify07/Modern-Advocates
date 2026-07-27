"use client"

import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import type { TeamMember } from "../types"

interface TeamTableProps {
  members: TeamMember[]
  onEdit: (member: TeamMember) => void
  onCancelInvite: (member: TeamMember) => void
  isLoading?: boolean
  total?: number
  role?: string | null
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-6 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-44" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
    </TableRow>
  ))
}

export function TeamTable({
  members,
  onEdit,
  onCancelInvite,
  isLoading,
  total,
  role,
}: TeamTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Permission</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : members.length === 0 ? (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={6} className="py-20 text-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold">
                    {total === 0
                      ? "No team members yet"
                      : "No team members found"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {total === 0
                      ? "Team members will appear here once invited."
                      : "There are no team members matching your criteria."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            members.map((m) => (
              <TableRow className="hover:bg-[#F5F7FA]" key={m.id}>
                <TableCell className="font-normal">
                  {m.name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {m.email}
                </TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell>
                  {m.status === "Active" ? (
                    <Badge
                      variant="secondary"
                      className="rounded-[8px] bg-green-700/10 font-normal text-green-700"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="rounded-[8px] bg-amber-700/10 font-normal text-amber-700"
                    >
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {m.lastLogin ?? "—"}
                </TableCell>
                <TableCell>
                  {m.status === "Pending" ? (
                    role === "admin" || role === "manager" ? (
                      <button
                        onClick={() => onCancelInvite(m)}
                        className="text-red-600 underline-offset-4 hover:underline"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )
                  ) : !role ||
                  (role !== "admin" && role !== "manager") ||
                  m.role === "Admin" ? (
                    <span className="text-muted-foreground/50">—</span>
                  ) : (
                    <button
                      onClick={() => onEdit(m)}
                      className="text-ma-admin-primary underline-offset-4 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
