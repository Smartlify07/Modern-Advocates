"use client"

import { useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { CheckoutForm } from "@/features/user-dashboard/components/checkout-form"
import { OrderSummaryCard } from "@/features/user-dashboard/components/order-summary-card"
import { PaymentReceiptModal } from "@/features/user-dashboard/components/payment-receipt-modal"
import { PaymentSuccessContent } from "@/features/user-dashboard/components/payment-success-content"
import { PaymentFailedContent } from "@/features/user-dashboard/components/payment-failed-content"
import { TransactionDetails } from "@/features/user-dashboard/components/transaction-details"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId")

  const [paymentState, setPaymentState] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle")
  const [modalOpen, setModalOpen] = useState(false)

  const handlePay = useCallback(() => {
    setPaymentState("processing")
    setTimeout(async () => {
      const ok = Math.random() > 0.5
      if (ok) {
        try {
          await fetch("/api/enrollments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId }),
          })
        } catch {
          // enrollment failure is non-blocking — redirect anyway
        }
        router.push("/my-learning")
      } else {
        setPaymentState("failed")
        setModalOpen(true)
      }
    }, 1500)
  }, [courseId, router])

  const handleRetry = useCallback(() => {
    setModalOpen(false)
    setTimeout(() => {
      setPaymentState("idle")
    }, 300)
  }, [])

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
      <CheckoutForm />

      <div>
        <OrderSummaryCard
          onPay={handlePay}
          processing={paymentState === "processing"}
        />
        <p className="mt-4 text-xs text-[#6b7280]">
          Course ID: {courseId ?? "N/A"}
        </p>
      </div>

      <PaymentReceiptModal open={modalOpen} onOpenChange={setModalOpen}>
        {paymentState === "success" ? (
          <PaymentSuccessContent />
        ) : (
          <PaymentFailedContent onRetry={handleRetry} />
        )}
      </PaymentReceiptModal>
    </div>
  )
}
