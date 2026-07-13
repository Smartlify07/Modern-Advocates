import { loadStripe, type Stripe } from "@stripe/stripe-js"

let _stripePromise: Promise<Stripe | null> | null = null

export function getStripeClient(): Promise<Stripe | null> {
  if (!_stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      _stripePromise = Promise.reject(
        new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set"),
      )
      _stripePromise.catch(() => {})
    } else {
      _stripePromise = loadStripe(key)
    }
  }
  return _stripePromise
}
