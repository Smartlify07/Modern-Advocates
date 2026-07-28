import { useState, useCallback } from "react"
import {
  createPaymentIntent,
  confirmPaymentOnServer,
  createOrder,
} from "@/shared/api/orders"
import { formatStripeError } from "@/features/orders/services/stripe-errors"
import type { FormattedStripeError } from "@/features/orders/services/stripe-errors"
import type {
  PaymentState,
  CheckoutFormHandle,
} from "@/features/user-dashboard/types/checkout"
import type { Order } from "@/shared/api/orders"

export function useCheckoutPayment() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>("loading")
  const [modalOpen, setModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<FormattedStripeError | null>(
    null
  )
  const [paymentReady, setPaymentReady] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

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
      setErrorMessage({
        title: "Service Error",
        description: "Could not initialize payment.",
      })
      setModalOpen(true)
    }
  }, [])

  const handleFreeCourse = useCallback(async (courseId: string) => {
    setPaymentState("loading")
    try {
      const { order: createdOrder, enrollment } = await createOrder(courseId)
      setOrder(createdOrder)
      if (enrollment?.status === "active") {
        setPaymentState("enrollment_complete")
        setModalOpen(true)
      } else {
        setPaymentState("payment_failed")
        setErrorMessage({
          title: "Enrollment Failed",
          description:
            enrollment?.status === "pending"
              ? "Enrollment is pending. Please try again."
              : "Could not complete enrollment for this course.",
        })
        setModalOpen(true)
      }
    } catch {
      setPaymentState("payment_failed")
      setErrorMessage({
        title: "Enrollment Failed",
        description: "Could not process free enrollment.",
      })
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
        const e = err as {
          type?: string
          code?: string
          message?: string
        } | null
        setErrorMessage(
          formatStripeError({
            type: e?.type,
            code: e?.code,
            message: e?.message,
          })
        )
        setModalOpen(true)
        return
      }

      try {
        const { order: confirmedOrder } = await confirmPaymentOnServer(orderId)
        setOrder(confirmedOrder)
        setPaymentState("enrollment_complete")
        setModalOpen(true)
      } catch {
        setPaymentState("confirmation_needed")
        setErrorMessage({
          title: "Confirmation Pending",
          description:
            "Your payment was received but we couldn't confirm your enrollment. Please retry.",
        })
        setModalOpen(true)
      }
    },
    [orderId]
  )

  const handleRetry = useCallback(
    async (courseId: string) => {
      setModalOpen(false)
      setPaymentReady(false)

      if (paymentSubmitted) {
        setPaymentState("processing")
        try {
          const { order: confirmedOrder } = await confirmPaymentOnServer(
            orderId!
          )
          setOrder(confirmedOrder)
          setPaymentState("enrollment_complete")
          setPaymentSubmitted(false)
          setModalOpen(true)
        } catch {
          setPaymentState("confirmation_needed")
          setErrorMessage({
            title: "Confirmation Pending",
            description:
              "Your payment was received but we couldn't confirm your enrollment. Please retry.",
          })
          setModalOpen(true)
        }
      } else {
        setFormKey((k) => k + 1)
        initPayment(courseId)
      }
    },
    [paymentSubmitted, orderId, initPayment]
  )

  const handleModalChange = useCallback((open: boolean) => {
    if (!open) {
      setPaymentState((prev) =>
        prev === "payment_failed" || prev === "confirmation_needed"
          ? "ready"
          : prev
      )
    }
    setModalOpen(open)
  }, [])

  const getTransactionDetails = useCallback(() => {
    if (!order) return null
    const createdAt = new Date(order.createdAt)
    return {
      referenceNumber: order.paymentReference ?? order.id,
      date: createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: createdAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      paymentMethod:
        order.paymentProvider === "stripe"
          ? "Credit Card"
          : (order.paymentProvider ?? "N/A"),
      amount: `$ ${order.amount.toFixed(2)} ${order.currency.toUpperCase()}`,
    }
  }, [order])

  return {
    orderId,
    clientSecret,
    paymentState,
    modalOpen,
    errorMessage,
    paymentReady,
    formKey,
    order,
    getTransactionDetails,
    setPaymentReady,
    initPayment,
    handleFreeCourse,
    handlePay,
    handleRetry,
    handleModalChange,
  }
}
