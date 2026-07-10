"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { createOrder, getOrderStatus, retryEnrollment } from "@/shared/api/orders"
import { CheckoutForm } from "@/features/user-dashboard/components/checkout-form"
import {
  OrderSummaryCard,
  type OrderSummaryCourseData,
} from "@/features/user-dashboard/components/order-summary-card"
import { PaymentReceiptModal } from "@/features/user-dashboard/components/payment-receipt-modal"
import { PaymentSuccessContent } from "@/features/user-dashboard/components/payment-success-content"
import { PaymentFailedContent } from "@/features/user-dashboard/components/payment-failed-content"

type PaymentState =
  | "idle"
  | "processing"
  | "success"
  | "enrollment_complete"
  | "payment_failed"
  | "enrollment_failed"

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 10

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId")

  const [paymentState, setPaymentState] = useState<PaymentState>("idle")
  const [modalOpen, setModalOpen] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const pollCountRef = useRef(0)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { data: course } = useQuery<OrderSummaryCourseData>({
    queryKey: ["course", courseId],
    queryFn: () =>
      fetch(`/api/courses/${courseId}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch course")
        return r.json()
      }).then((c) => ({
        title: c.title,
        price: c.price,
        discountedPrice: c.discountedPrice,
        thumbnailUrl: c.thumbnailUrl,
      })),
    enabled: !!courseId,
  })

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    pollCountRef.current = 0
  }, [])

  const startPolling = useCallback(
    (id: string) => {
      pollCountRef.current = 0
      pollIntervalRef.current = setInterval(async () => {
        pollCountRef.current++
        if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
          clearPolling()
          setPaymentState("enrollment_failed")
          return
        }
        try {
          const { enrollment } = await getOrderStatus(id)
          if (enrollment?.status === "active") {
            clearPolling()
            setPaymentState("enrollment_complete")
            setTimeout(() => router.push("/my-learning"), 1000)
          } else if (enrollment?.status === "failed") {
            clearPolling()
            setPaymentState("enrollment_failed")
          }
        } catch {
          // keep polling on transient errors
        }
      }, POLL_INTERVAL_MS)
    },
    [clearPolling, router],
  )

  const handlePay = useCallback(async () => {
    if (!courseId) return
    setPaymentState("processing")

    await new Promise((r) => setTimeout(r, 1200))

    try {
      const { order: createdOrder, enrollment } = await createOrder(courseId)
      setOrderId(createdOrder.id)

      if (enrollment?.status === "active") {
        setPaymentState("enrollment_complete")
        setModalOpen(true)
        setTimeout(() => router.push("/my-learning"), 1000)
        return
      }

      setPaymentState("success")
      setModalOpen(true)
      startPolling(createdOrder.id)
    } catch {
      setPaymentState("payment_failed")
      setModalOpen(true)
    }
  }, [courseId, router, startPolling])

  const handleRetryPayment = useCallback(() => {
    setModalOpen(false)
    clearPolling()
    setOrderId(null)
    setTimeout(() => setPaymentState("idle"), 300)
  }, [clearPolling])

  const handleRetryEnrollment = useCallback(async () => {
    if (!orderId) return
    try {
      await retryEnrollment(orderId)
      setPaymentState("success")
      startPolling(orderId)
    } catch {
      setPaymentState("enrollment_failed")
    }
  }, [orderId, startPolling])

  useEffect(() => {
    return () => clearPolling()
  }, [clearPolling])

  const handleModalChange = useCallback(
    (open: boolean) => {
      if (!open && (paymentState === "payment_failed" || paymentState === "enrollment_failed")) {
        if (paymentState === "payment_failed") handleRetryPayment()
        else {
          setModalOpen(false)
          clearPolling()
          setTimeout(() => setPaymentState("idle"), 300)
        }
        return
      }
      setModalOpen(open)
    },
    [paymentState, handleRetryPayment, clearPolling],
  )

  const displayPrice = course
    ? (course.discountedPrice ?? course.price).toFixed(2)
    : "0.00"

  if (!courseId) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg text-[#6b7280]">No course selected.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
      <CheckoutForm />

      <div>
        {course ? (
          <OrderSummaryCard
            course={course}
            onPay={handlePay}
            processing={paymentState === "processing"}
          />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-[#f9f9f9]">
            <p className="text-sm text-[#6b7280]">Loading course details...</p>
          </div>
        )}
        <p className="mt-4 text-xs text-[#6b7280]">
          Course ID: {courseId ?? "N/A"}
        </p>
      </div>

      <PaymentReceiptModal open={modalOpen} onOpenChange={handleModalChange}>
        {paymentState === "payment_failed" ? (
          <PaymentFailedContent mode="payment" onRetry={handleRetryPayment} />
        ) : paymentState === "enrollment_failed" ? (
          <PaymentFailedContent mode="enrollment" onRetry={handleRetryEnrollment} />
        ) : (
          <PaymentSuccessContent
            amount={`$ ${displayPrice} USD`}
            polling={paymentState === "success"}
            onRedirect={
              paymentState === "enrollment_complete"
                ? () => router.push("/my-learning")
                : undefined
            }
          />
        )}
      </PaymentReceiptModal>
    </div>
  )
}
