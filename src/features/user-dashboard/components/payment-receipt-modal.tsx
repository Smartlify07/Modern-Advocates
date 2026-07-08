import type { ReactNode } from "react"
import { X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
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
      <DialogContent className="p-0 sm:max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between border-b border-b-[#E9EAF0] px-7.5 py-4">
          <h2 className="text-base/[100%] font-medium text-ma-text">Receipt</h2>
          <DialogClose asChild>
            <button
              type="button"
              className="flex size-4.5 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="size-4.5 text-[#6b7280]" />
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-6 px-7.5 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
