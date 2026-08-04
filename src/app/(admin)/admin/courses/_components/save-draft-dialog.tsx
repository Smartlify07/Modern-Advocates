"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { FileTextIcon, Loader2Icon } from "lucide-react"

interface SaveDraftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export function SaveDraftDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: SaveDraftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Save as Draft</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-ma-warning/10">
            <div className="flex size-10 items-center justify-center rounded-full bg-ma-warning">
              <FileTextIcon className="size-5 text-white" />
            </div>
          </div>
          <p className="text-[30px] font-semibold">Save as draft?</p>
          <p className="text-left align-middle text-sm tracking-tight-md text-muted-foreground">
            You can come back anytime to update it and you can also publish it later.
          </p>
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 bg-white px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-pill flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="h-pill flex-1 rounded-button-medium bg-ma-warning px-6 py-4 text-white hover:bg-ma-warning/80"
            onClick={() => { if (!isPending) onConfirm() }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              "Save as Draft"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
