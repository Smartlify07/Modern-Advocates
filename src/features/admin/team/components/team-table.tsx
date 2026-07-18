"use client"

import { Badge } from "@/shared/ui/badge"
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
}

export function TeamTable({ members, onEdit }: TeamTableProps) {
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
          {members.map((m) => (
            <TableRow className="hover:bg-[#F5F7FA]" key={m.id}>
              <TableCell className="font-normal">{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.email}</TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="rounded-[8px] bg-green-700/10 font-normal text-green-700"
                >
                  {m.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{m.lastLogin}</TableCell>
              <TableCell>
                {m.role === "Admin" && m.id === "1" ? (
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
