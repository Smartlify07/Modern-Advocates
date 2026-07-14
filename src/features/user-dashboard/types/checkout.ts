import type { FormattedStripeError } from "@/features/orders/services/stripe-errors"

export type PaymentState =
  | "loading"
  | "ready"
  | "processing"
  | "enrollment_complete"
  | "confirmation_needed"
  | "payment_failed"

export interface CheckoutFormHandle {
  submitPayment: () => Promise<void>
}

export type OrderSummaryCourseData = {
  title: string
  price: number
  discountedPrice: number | null
  thumbnailUrl: string | null
  isFree?: boolean
}

export interface CheckoutPaymentState {
  orderId: string | null
  clientSecret: string | null
  paymentState: PaymentState
  modalOpen: boolean
  errorMessage: FormattedStripeError | null
  paymentReady: boolean
  formKey: number
}
