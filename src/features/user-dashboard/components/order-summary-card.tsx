"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"

export function OrderSummaryCard({
  onPay,
  processing,
}: {
  onPay: () => void
  processing: boolean
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-[#f9f9f9] p-6">
      <h3 className="text-base font-bold text-ma-text">Order Summary</h3>

      <div className="flex gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src="/figma-courses/tutor-maxwell.png"
            alt="Course thumbnail"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-ma-text">
            Build Foundational AI skills
          </p>
          <p className="text-sm text-[#6b7280]">$100.00 USD</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#e5e7eb] pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Original Price</span>
          <span className="text-ma-text">$100.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6b7280]">Discount (00% off)</span>
          <span className="text-[#6b7280]">-$00.00</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-[#e5e7eb] pt-4">
        <span className="text-base font-bold text-ma-text">Total:</span>
        <span className="text-base font-bold text-ma-text">$100.00 USD</span>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={processing}
        className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {processing ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay $100.00
            <ArrowRight className="size-5" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-[#6b7280]">
        Your payment is fully encrypted and handled with the highest security
        standards.
      </p>
    </div>
  )
}
