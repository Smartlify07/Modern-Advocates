import { useRef } from "react"
import { getStripeClient } from "@/infrastructure/payment/stripe-client"

export function useStripePromise() {
  const ref = useRef<ReturnType<typeof getStripeClient> | null>(null)

  function getPromise() {
    if (!ref.current) {
      ref.current = getStripeClient()
    }
    return ref.current
  }

  return getPromise
}
