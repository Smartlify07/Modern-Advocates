"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Trash2Icon, Loader2Icon } from "lucide-react"
import type { User } from "@/features/admin/users/types"

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (user: User) => void
  isPending: boolean
}

export function DeleteUserDialog({ open, onOpenChange, user, onConfirm, isPending }: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Delete User</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <Trash2Icon className="size-6 text-destructive" />
          </div>
          <p className="text-base font-semibold">Delete this user?</p>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            This action is permanent and cannot be undone. The user will be
            removed from the system and all their data including enrollments,
            course progress, certificates, and purchase history will be
            permanently deleted.
          </p>
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
            onClick={() => { if (user && !isPending) onConfirm(user) }}
            disabled={isPending}
          >
            {isPending ? <Loader2Icon className="size-5 animate-spin" /> : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
