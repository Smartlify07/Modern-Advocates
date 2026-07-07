import type { ReactNode } from "react"
import { X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/shared/ui/dialog"

export function PaymentReceiptModal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ma-text">Receipt</h2>
          <DialogClose asChild>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="size-5 text-[#6b7280]" />
            </button>
          </DialogClose>
        </div>

        <div className="flex flex-col gap-6">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
