"use client"

import { forwardRef, useImperativeHandle, useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { User, Mail } from "lucide-react"

import { authClient } from "@/infrastructure/auth/client"

export interface CheckoutFormHandle {
  submitPayment: () => Promise<void>
}

export const CheckoutForm = forwardRef<CheckoutFormHandle>(
  function CheckoutForm(_props, ref) {
    const stripe = useStripe()
    const elements = useElements()
    const { data: session } = authClient.useSession()
    const [error, setError] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
      submitPayment: async () => {
        if (!stripe || !elements) return
        setError(null)

        const { error: stripeError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/my-learning`,
          },
          redirect: "if_required",
        })

        if (stripeError) {
          const msg = stripeError.message ?? "Payment failed"
          setError(msg)
          throw new Error(msg)
        }
      },
    }))

    return (
      <div className="flex flex-col gap-6">
        <p className="text-sm font-bold tracking-[0.1em] text-[#6b7280] uppercase">
          Checkout
        </p>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-ma-text">Billing Information</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white p-3">
              <User className="size-5 text-[#6b7280]" />
              <span className="text-sm text-ma-text">{session?.user.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white p-3">
              <Mail className="size-5 text-[#6b7280]" />
              <span className="text-sm text-ma-text">{session?.user.email ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-ma-text">Payment Method</h3>
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
            <PaymentElement />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  },
)
