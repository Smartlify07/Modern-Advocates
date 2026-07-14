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

  const initPayment = useCallback((courseId: string) => {
    setPaymentState("loading")
    createPaymentIntent(courseId)
      .then((res) => {
        setOrderId(res.orderId)
        setClientSecret(res.clientSecret)
        setPaymentState("ready")
      })
      .catch(() => {
        setPaymentState("payment_failed")
        setErrorMessage({ title: "Service Error", description: "Could not initialize payment." })
        setModalOpen(true)
      })
  }, [])

  const handleFreeCourse = useCallback((courseId: string) => {
    setPaymentState("loading")
    createOrder(courseId)
      .then(({ enrollment }) => {
        if (enrollment?.status === "active") {
          setPaymentState("enrollment_complete")
          setModalOpen(true)
        }
      })
      .catch(() => {
        setPaymentState("payment_failed")
        setErrorMessage({ title: "Enrollment Failed", description: "Could not process free enrollment." })
        setModalOpen(true)
      })
  }, [])

  const handlePay = useCallback(
    async (formRef: React.RefObject<CheckoutFormHandle | null>) => {
      if (!formRef.current || !orderId) return
      setPaymentState("processing")
      try {
        await formRef.current.submitPayment()
        await confirmPaymentOnServer(orderId)
        setPaymentState("enrollment_complete")
        setModalOpen(true)
      } catch (err: unknown) {
        setPaymentState("payment_failed")
        const e = err as { type?: string; code?: string; message?: string } | null
        setErrorMessage(formatStripeError({ type: e?.type, code: e?.code, message: e?.message }))
        setModalOpen(true)
      }
    },
    [orderId],
  )

  const handleRetry = useCallback(
    (courseId: string) => {
      setModalOpen(false)
      setPaymentReady(false)
      setFormKey((k) => k + 1)
      initPayment(courseId)
    },
    [initPayment],
  )

  const handleModalChange = useCallback((open: boolean) => {
    if (!open) {
      setPaymentState((prev) => (prev === "payment_failed" ? "ready" : prev))
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
