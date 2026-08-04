"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import {
  AlertTriangleIcon,
  CircleAlert,
  CircleIcon,
  Loader2Icon,
} from "lucide-react"
import type { User } from "@/features/admin/users/types"

interface SuspendUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (user: User) => void
  isPending: boolean
}

export function SuspendUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: SuspendUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Suspend User</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-ma-warning-bg">
            <div className="flex size-10 items-center justify-center rounded-full bg-ma-warning">
              <CircleAlert className="size-5 text-white" />
            </div>
          </div>
          <p className="text-[30px] font-semibold">Suspend this user?</p>
          <p className="text-left align-middle text-sm tracking-tight-md text-muted-foreground">
            This user will no longer be able to sign in or access their account.
            Their profile, enrollments, course progress, certificates, and
            purchase history will be preserved. You can reactivate this account
            at any time.
          </p>
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-pill flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="h-pill flex-1 rounded-button-medium bg-ma-warning-bg px-6 py-4 text-ma-warning hover:bg-ma-warning hover:text-white"
            onClick={() => {
              if (user && !isPending) onConfirm(user)
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              "Suspend User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
