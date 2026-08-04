"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { formatCurrency } from "@/shared/utils"
import type { Donation } from "@/features/admin/donations/types"
import { donationTypeLabels } from "@/features/admin/donations/types"

interface DonationsTableProps {
  donations: Donation[]
}

export function DonationsTable({ donations }: DonationsTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-ma-surface-2 hover:bg-ma-surface-2">
            <TableHead className="w-[220px]">Name</TableHead>
            <TableHead className="w-[280px]">Email</TableHead>
            <TableHead className="w-[120px]">Amount</TableHead>
            <TableHead className="w-[160px]">Donation Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((d) => (
            <TableRow className="hover:bg-ma-bg" key={d.id}>
              <TableCell className="font-normal">{d.donorName}</TableCell>
              <TableCell className="text-muted-foreground">
                {d.donorEmail}
              </TableCell>
              <TableCell className="font-medium tabular-nums">
                {formatCurrency(d.amount)}
              </TableCell>
              <TableCell className="font-normal">
                {donationTypeLabels[d.donationType]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
