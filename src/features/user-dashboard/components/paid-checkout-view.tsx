import { useRouter } from "next/navigation"
import { useRef } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "@/features/user-dashboard/components/checkout-form"
import { OrderSummaryCard } from "@/features/user-dashboard/components/order-summary-card"
import { PaymentReceiptModal } from "@/features/user-dashboard/components/payment-receipt-modal"
import { PaymentSuccessContent } from "@/features/user-dashboard/components/payment-success-content"
import { PaymentFailedContent } from "@/features/user-dashboard/components/payment-failed-content"
import { CheckoutSkeleton } from "@/features/user-dashboard/components/checkout-skeleton"
import type { OrderSummaryCourseData, PaymentState, CheckoutFormHandle } from "@/features/user-dashboard/types/checkout"
import type { FormattedStripeError } from "@/features/orders/services/stripe-errors"

export function PaidCheckoutView({
  course,
  courseId,
  clientSecret,
  orderId,
  paymentState,
  modalOpen,
  errorMessage,
  paymentReady,
  formKey,
  getStripePromise,
  onPay,
  onRetry,
  onModalChange,
  onReadyChange,
}: {
  course: OrderSummaryCourseData
  courseId: string
  clientSecret: string | null
  orderId: string | null
  paymentState: PaymentState
  modalOpen: boolean
  errorMessage: FormattedStripeError | null
  paymentReady: boolean
  formKey: number
  getStripePromise: () => Promise<import("@stripe/stripe-js").Stripe | null>
  onPay: (formRef: React.RefObject<CheckoutFormHandle | null>) => Promise<void>
  onRetry: () => void
  onModalChange: (open: boolean) => void
  onReadyChange: (ready: boolean) => void
}) {
  const router = useRouter()
  const formRef = useRef<CheckoutFormHandle>(null)
  const displayPrice = (course.discountedPrice ?? course.price).toFixed(2)

  if (!clientSecret || !orderId) {
    return <CheckoutSkeleton />
  }

  return (
    <>
      <Elements stripe={getStripePromise()} options={{ clientSecret }}>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
          <CheckoutForm key={formKey} ref={formRef} onReadyChange={onReadyChange} />
          <div>
            <OrderSummaryCard
              course={course}
              onPay={() => onPay(formRef)}
              processing={paymentState === "processing"}
              disabled={paymentState !== "ready" || !paymentReady}
            />
            <p className="mt-4 text-xs text-[#6b7280]">Course ID: {courseId}</p>
          </div>
        </div>
      </Elements>

      <PaymentReceiptModal open={modalOpen} onOpenChange={onModalChange}>
        {paymentState === "payment_failed" ? (
          <PaymentFailedContent
            mode="payment"
            title={errorMessage?.title}
            description={errorMessage?.description}
            onRetry={onRetry}
          />
        ) : (
          <PaymentSuccessContent
            amount={`$ ${displayPrice} USD`}
            polling={false}
            onRedirect={
              paymentState === "enrollment_complete"
                ? () => router.replace("/my-learning")
                : undefined
            }
          />
        )}
      </PaymentReceiptModal>
    </>
  )
}
