"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import {
  Loader2Icon,
  MessageSquareReplyIcon,
  CheckCircle2Icon,
  CircleIcon,
} from "lucide-react"
import { UserAvatar } from "@/shared/ui/user-avatar"
import type { Ticket } from "../types"

interface ViewTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: Ticket | null
  onStatusChange: (id: string, status: string) => void
  isPending: boolean
}

export function ViewTicketDialog({
  open,
  onOpenChange,
  ticket,
  onStatusChange,
  isPending,
}: ViewTicketDialogProps) {
  const [reply, setReply] = useState("")

  const handleSendMessage = () => {
    if (!ticket) return
    const subject = encodeURIComponent(`Re: Support Ticket #${ticket.id}`)
    const body = encodeURIComponent(
      reply
        ? `Dear ${ticket.name},\n\n${reply}\n\n`
        : `Dear ${ticket.name},\n\nRegarding your message:\n"${ticket.message}"\n\n`
    )
    window.open(
      `mailto:${ticket.email}?subject=${subject}&body=${body}&cc=modadvinc@gmail.com`,
      "_blank"
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={ticket?.id}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">View Ticket</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{ name: ticket?.name }}
              className="size-[50px] bg-ma-admin-primary text-white"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{ticket?.name}</span>
              <span className="text-sm text-muted-foreground">
                {ticket?.email}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ticket?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="ticket-reply"
              className="text-sm font-medium text-foreground"
            >
              Reply message
            </label>
            <textarea
              id="ticket-reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="h-[140px] w-full min-w-0 resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <DialogFooter className="-mx-7.5 border-t bg-white px-7.5 pb-4 sm:justify-start">
          {ticket?.status !== "resolved" ? (
            <Button
              className="h-[53px] flex-1 rounded-button-medium border border-ma-admin-primary bg-white px-6 py-4 text-ma-admin-primary hover:bg-ma-admin-primary/10"
              onClick={() => {
                if (ticket && !isPending) onStatusChange(ticket.id, "resolved")
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2Icon strokeWidth={1.5} className="mr-2 size-4" />
                  Mark as Resolved
                </>
              )}
            </Button>
          ) : (
            <Button
              className="h-[53px] flex-1 rounded-button-medium border border-amber-500 bg-white px-6 py-4 text-amber-600 hover:bg-amber-50"
              onClick={() => {
                if (ticket && !isPending) onStatusChange(ticket.id, "open")
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <>
                  <CircleIcon strokeWidth={1.5} className="mr-2 size-4" />
                  Mark as Unresolved
                </>
              )}
            </Button>
          )}
          <Button
            className="h-[53px] flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-white hover:bg-ma-admin-primary/80"
            onClick={handleSendMessage}
          >
            <MessageSquareReplyIcon strokeWidth={1.5} className="mr-2 size-4" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
