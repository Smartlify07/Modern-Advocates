import { loadStripe } from "@stripe/stripe-js"

let _stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripeClient() {
  if (!_stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
    }
    _stripePromise = loadStripe(key)
  }
  return _stripePromise
}
