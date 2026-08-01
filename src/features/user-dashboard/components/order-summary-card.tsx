"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"

import type { OrderSummaryCourseData } from "@/features/user-dashboard/types/checkout"

export function OrderSummaryCard({
  course,
  onPay,
  onError,
  processing,
  disabled,
}: {
  course: OrderSummaryCourseData
  onPay?: () => void
  onError?: (msg: string) => void
  processing: boolean
  disabled?: boolean
}) {
  const displayPrice = course.discountedPrice ?? course.price
  const originalPrice = course.discountedPrice ? course.price : null
  const discountPercent = originalPrice
    ? Math.round((1 - displayPrice / originalPrice) * 100)
    : 0

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-ma-surface-2 p-6">
      <h3 className="text-base font-bold text-ma-text">Order Summary</h3>

      <div className="flex gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gray-200" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-ma-text">{course.title}</p>
          <p className="text-sm text-muted-foreground">${displayPrice.toFixed(2)} USD</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Original Price</span>
          <span className="text-ma-text">${(originalPrice ?? displayPrice).toFixed(2)}</span>
        </div>
        {originalPrice && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount ({discountPercent}% off)</span>
            <span className="text-muted-foreground">-${(originalPrice - displayPrice).toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-border pt-4">
        <span className="text-base font-bold text-ma-text">Total:</span>
        <span className="text-base font-bold text-ma-text">${displayPrice.toFixed(2)} USD</span>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={processing || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-ma-text px-5 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {processing ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay ${displayPrice.toFixed(2)}
            <ArrowRight className="size-5" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Your payment is fully encrypted and handled with the highest security
        standards.
      </p>
    </div>
  )
}
