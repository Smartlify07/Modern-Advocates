import { useRouter } from "next/navigation"
import { OrderSummaryCard } from "@/features/user-dashboard/components/order-summary-card"
import { PaymentReceiptModal } from "@/features/user-dashboard/components/payment-receipt-modal"
import { PaymentSuccessContent } from "@/features/user-dashboard/components/payment-success-content"
import { PaymentFailedContent } from "@/features/user-dashboard/components/payment-failed-content"
import type { OrderSummaryCourseData, PaymentState } from "@/features/user-dashboard/types/checkout"
import type { FormattedStripeError } from "@/features/orders/services/stripe-errors"

export function FreeCheckoutView({
  course,
  paymentState,
  modalOpen,
  errorMessage,
  onRetry,
  onModalChange,
}: {
  course: OrderSummaryCourseData
  paymentState: PaymentState
  modalOpen: boolean
  errorMessage: FormattedStripeError | null
  onRetry: () => void
  onModalChange: (open: boolean) => void
}) {
  const router = useRouter()

  return (
    <>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
        <div />
        <div>
          <OrderSummaryCard course={course} processing={false} disabled />
        </div>
      </div>

      <PaymentReceiptModal open={modalOpen} onOpenChange={onModalChange}>
        {paymentState === "payment_failed" ? (
          <PaymentFailedContent
            mode="enrollment"
            title={errorMessage?.title}
            description={errorMessage?.description}
            onRetry={onRetry}
          />
        ) : (
          <PaymentSuccessContent
            amount="Free"
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
