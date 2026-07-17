"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { CircleAlert, Loader2Icon } from "lucide-react"
import type { User } from "@/features/admin/users/types"

interface ActivateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (user: User) => void
  isPending: boolean
}

export function ActivateUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: ActivateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Activate User</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-ma-admin-primary/10">
            <div className="flex size-10 items-center justify-center rounded-full bg-ma-admin-primary">
              <CircleAlert className="size-5 text-white" />
            </div>
          </div>
          <p className="text-[30px] font-semibold">Reactivate this user?</p>
          <p className="text-left align-middle text-sm tracking-[-1.5%] text-muted-foreground">
            This user will regain access to their account and can sign in
            immediately. All previous enrollments, course progress,
            certificates, and purchases will be available exactly as they were
            before suspension.
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
            className="h-[53px] flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-ma-admin-primary text-white hover:bg-ma-admin-primary/80 hover:text-white"
            onClick={() => {
              if (user && !isPending) onConfirm(user)
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              "Activate User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
