"use client"

import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Separator } from "@/shared/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { cn } from "@/shared/utils"
import { MoreHorizontalIcon, EyeIcon, MessageSquareReplyIcon, Trash2Icon } from "lucide-react"
import type { Ticket } from "../types"

interface SupportTableProps {
  tickets: Ticket[]
  onView?: (ticket: Ticket) => void
  onDelete?: (id: string) => void
}

const statusStyles: Record<string, string> = {
  open: "bg-green-700/10 text-green-700",
  pending: "bg-amber-100 text-amber-800",
  resolved: "bg-slate-100 text-slate-600",
}

export function SupportTable({ tickets, onView, onDelete }: SupportTableProps) {
  const adminEmail = "modadvinc@gmail.com"

  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead className="w-[180px]">Name</TableHead>
            <TableHead className="w-[240px]">Email</TableHead>
            <TableHead className="w-[260px]">Message</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[80px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={6} className="py-20 text-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold">No tickets found</p>
                  <p className="text-sm text-muted-foreground">
                    There are no support tickets matching your criteria.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow className="hover:bg-[#F5F7FA]" key={ticket.id}>
                <TableCell>
                  <span className="font-normal">{ticket.name}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {ticket.email}
                </TableCell>
                <TableCell className="max-w-[260px] truncate text-muted-foreground">
                  {ticket.message}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("rounded-[8px] font-normal", statusStyles[ticket.status])}
                  >
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {ticket.date}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-6 rounded-full border border-[#141B34]"
                      >
                        <MoreHorizontalIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="gap-2.5 p-2"
                          onSelect={() => onView?.(ticket)}
                        >
                          <EyeIcon strokeWidth={1.5} className="size-4" />
                          View ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2.5 p-2"
                          onSelect={() => {
                            const subject = encodeURIComponent(`Re: Support Ticket #${ticket.id}`)
                            const body = encodeURIComponent(
                              `Dear ${ticket.name},\n\nRegarding your message:\n"${ticket.message}"\n\n`,
                            )
                            window.open(`mailto:${ticket.email}?subject=${subject}&body=${body}&cc=${adminEmail}`, "_blank")
                          }}
                        >
                          <MessageSquareReplyIcon strokeWidth={1.5} className="size-4" />
                          Reply
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <Separator className="my-1.5" />
                      <DropdownMenuItem
                        className="gap-2.5 p-2"
                        variant="destructive"
                        onSelect={() => onDelete?.(ticket.id)}
                      >
                        <Trash2Icon strokeWidth={1.5} className="size-4" />
                        Delete ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
