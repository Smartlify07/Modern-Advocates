"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Elements } from "@stripe/react-stripe-js"

import {
  createOrder,
  createPaymentIntent,
  confirmPaymentOnServer,
} from "@/shared/api/orders"
import {
  CheckoutForm,
  type CheckoutFormHandle,
} from "@/features/user-dashboard/components/checkout-form"
import {
  OrderSummaryCard,
  type OrderSummaryCourseData,
} from "@/features/user-dashboard/components/order-summary-card"
import { PaymentReceiptModal } from "@/features/user-dashboard/components/payment-receipt-modal"
import { PaymentSuccessContent } from "@/features/user-dashboard/components/payment-success-content"
import { PaymentFailedContent } from "@/features/user-dashboard/components/payment-failed-content"
import { getStripeClient } from "@/infrastructure/payment/stripe-client"
import { formatStripeError } from "@/features/orders/services/stripe-errors"
import type { FormattedStripeError } from "@/features/orders/services/stripe-errors"

type PaymentState =
  | "loading"
  | "ready"
  | "processing"
  | "enrollment_complete"
  | "payment_failed"

const stripePromise = getStripeClient()

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId")

  const [paymentState, setPaymentState] = useState<PaymentState>("loading")
  const [modalOpen, setModalOpen] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<FormattedStripeError | null>(
    null
  )
  const [paymentReady, setPaymentReady] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const checkoutFormRef = useRef<CheckoutFormHandle>(null)

  const { data: course } = useQuery<OrderSummaryCourseData>({
    queryKey: ["course", courseId],
    queryFn: () =>
      fetch(`/api/courses/${courseId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch course")
          return r.json()
        })
        .then((c) => ({
          title: c.title,
          price: c.price,
          discountedPrice: c.discountedPrice,
          thumbnailUrl: c.thumbnailUrl,
          isFree: c.isFree ?? false,
        })),
    enabled: !!courseId,
  })

  const initPayment = useCallback((courseId: string) => {
    createPaymentIntent(courseId)
      .then(({ orderId, clientSecret }) => {
        setOrderId(orderId)
        setClientSecret(clientSecret)
        setPaymentState("ready")
      })
      .catch(() => {
        setPaymentState("payment_failed")
        setErrorMessage({
          title: "Service Error",
          description: "Could not initialize payment.",
        })
        setModalOpen(true)
      })
  }, [])

  useEffect(() => {
    if (!course || !courseId) return
    if (course.isFree) {
      createOrder(courseId)
        .then(({ enrollment }) => {
          if (enrollment?.status === "active") {
            setPaymentState("enrollment_complete")
            setModalOpen(true)
            setTimeout(() => router.push("/my-learning"), 1000)
          }
        })
        .catch(() => {
          setPaymentState("payment_failed")
          setErrorMessage({
            title: "Enrollment Failed",
            description: "Could not process free enrollment.",
          })
          setModalOpen(true)
        })
      return
    }
    initPayment(courseId)
  }, [course, courseId, router, initPayment])

  const handlePay = useCallback(async () => {
    if (!checkoutFormRef.current || !orderId) return
    setPaymentState("processing")
    try {
      await checkoutFormRef.current.submitPayment()
      await confirmPaymentOnServer(orderId)
      setPaymentState("enrollment_complete")
      setModalOpen(true)
      setTimeout(() => router.push("/my-learning"), 1000)
    } catch (err: unknown) {
      setPaymentState("payment_failed")
      const stripeErr = err as {
        type?: string
        code?: string
        message?: string
      } | null
      const formatted = formatStripeError({
        type: stripeErr?.type,
        code: stripeErr?.code,
        message: stripeErr?.message,
      })
      setErrorMessage(formatted)
      setModalOpen(true)
    }
  }, [orderId, router])

  const handleRetry = useCallback(() => {
    setModalOpen(false)
    setPaymentReady(false)
    setFormKey((k) => k + 1)
    setPaymentState("loading")
    if (courseId) {
      initPayment(courseId)
    }
  }, [courseId, initPayment])

  const handleModalChange = useCallback((open: boolean) => {
    setModalOpen(open)
  }, [])

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

  if (!course) {
    return (
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="flex h-80 items-center justify-center rounded-2xl bg-[#f9f9f9]">
          <p className="text-sm text-[#6b7280]">Loading...</p>
        </div>
        <div className="flex h-80 items-center justify-center rounded-2xl bg-[#f9f9f9]">
          <p className="text-sm text-[#6b7280]">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (course.isFree) {
    return (
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
        <div />
        <div>
          <OrderSummaryCard course={course} processing={false} disabled />
        </div>
      </div>
    )
  }

  return (
    <>
      {clientSecret && orderId ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
            <CheckoutForm key={formKey} ref={checkoutFormRef} onReadyChange={setPaymentReady} />
            <div>
              <OrderSummaryCard
                course={course}
                onPay={handlePay}
                processing={paymentState === "processing"}
                disabled={paymentState !== "ready" || !paymentReady}
              />
              <p className="mt-4 text-xs text-[#6b7280]">
                Course ID: {courseId}
              </p>
            </div>
          </div>
        </Elements>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
          <div className="flex h-80 items-center justify-center rounded-2xl bg-[#f9f9f9]">
            <p className="text-sm text-[#6b7280]">Preparing payment...</p>
          </div>
          <div>
            <OrderSummaryCard course={course} processing={false} disabled />
          </div>
        </div>
      )}

      <PaymentReceiptModal open={modalOpen} onOpenChange={handleModalChange}>
        {paymentState === "payment_failed" ? (
          <PaymentFailedContent
            mode="payment"
            title={errorMessage?.title}
            description={errorMessage?.description}
            onRetry={handleRetry}
          />
        ) : (
          <PaymentSuccessContent
            amount={`$ ${displayPrice} USD`}
            polling={false}
            onRedirect={
              paymentState === "enrollment_complete"
                ? () => router.push("/my-learning")
                : undefined
            }
          />
        )}
      </PaymentReceiptModal>
    </>
  )
}
