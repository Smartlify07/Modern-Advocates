import { useState, useCallback } from "react"
import { createPaymentIntent, confirmPaymentOnServer, createOrder } from "@/shared/api/orders"
import { formatStripeError } from "@/features/orders/services/stripe-errors"
import type { FormattedStripeError } from "@/features/orders/services/stripe-errors"
import type { PaymentState, CheckoutFormHandle } from "@/features/user-dashboard/types/checkout"

export function useCheckoutPayment() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>("loading")
  const [modalOpen, setModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<FormattedStripeError | null>(null)
  const [paymentReady, setPaymentReady] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)

  const initPayment = useCallback(async (courseId: string) => {
    setPaymentState("loading")
    setPaymentSubmitted(false)
    try {
      const res = await createPaymentIntent(courseId)
      setOrderId(res.orderId)
      setClientSecret(res.clientSecret)
      setPaymentState("ready")
    } catch {
      setPaymentState("payment_failed")
      setErrorMessage({ title: "Service Error", description: "Could not initialize payment." })
      setModalOpen(true)
    }
  }, [])

  const handleFreeCourse = useCallback(async (courseId: string) => {
    setPaymentState("loading")
    try {
      const { enrollment } = await createOrder(courseId)
      if (enrollment?.status === "active") {
        setPaymentState("enrollment_complete")
        setModalOpen(true)
      } else {
        setPaymentState("payment_failed")
        setErrorMessage({
          title: "Enrollment Failed",
          description: enrollment?.status === "pending"
            ? "Enrollment is pending. Please try again."
            : "Could not complete enrollment for this course.",
        })
        setModalOpen(true)
      }
    } catch {
      setPaymentState("payment_failed")
      setErrorMessage({ title: "Enrollment Failed", description: "Could not process free enrollment." })
      setModalOpen(true)
    }
  }, [])

  const handlePay = useCallback(
    async (formRef: React.RefObject<CheckoutFormHandle | null>) => {
      if (!formRef.current || !orderId) return
      setPaymentState("processing")

      try {
        await formRef.current.submitPayment()
        setPaymentSubmitted(true)
      } catch (err: unknown) {
        setPaymentState("payment_failed")
        setPaymentSubmitted(false)
        const e = err as { type?: string; code?: string; message?: string } | null
        setErrorMessage(formatStripeError({ type: e?.type, code: e?.code, message: e?.message }))
        setModalOpen(true)
        return
      }

      try {
        await confirmPaymentOnServer(orderId)
        setPaymentState("enrollment_complete")
        setModalOpen(true)
      } catch {
        setPaymentState("confirmation_needed")
        setErrorMessage({
          title: "Confirmation Pending",
          description: "Your payment was received but we couldn't confirm your enrollment. Please retry.",
        })
        setModalOpen(true)
      }
    },
    [orderId],
  )

  const handleRetry = useCallback(
    async (courseId: string) => {
      setModalOpen(false)
      setPaymentReady(false)

      if (paymentSubmitted) {
        setPaymentState("processing")
        try {
          await confirmPaymentOnServer(orderId!)
          setPaymentState("enrollment_complete")
          setPaymentSubmitted(false)
          setModalOpen(true)
        } catch {
          setPaymentState("confirmation_needed")
          setErrorMessage({
            title: "Confirmation Pending",
            description: "Your payment was received but we couldn't confirm your enrollment. Please retry.",
          })
          setModalOpen(true)
        }
      } else {
        setFormKey((k) => k + 1)
        initPayment(courseId)
      }
    },
    [paymentSubmitted, orderId, initPayment],
  )

  const handleModalChange = useCallback((open: boolean) => {
    if (!open) {
      setPaymentState((prev) => (prev === "payment_failed" || prev === "confirmation_needed" ? "ready" : prev))
    }
    setModalOpen(open)
  }, [])

  return {
    orderId,
    clientSecret,
    paymentState,
    modalOpen,
    errorMessage,
    paymentReady,
    formKey,
    setPaymentReady,
    initPayment,
    handleFreeCourse,
    handlePay,
    handleRetry,
    handleModalChange,
  }
}
