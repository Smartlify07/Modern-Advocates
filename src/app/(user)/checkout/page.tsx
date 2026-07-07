import { Suspense } from "react"
import { CheckoutContent } from "@/features/user-dashboard/components/checkout-content"

export default function CheckoutPage() {
  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
      <h1 className="text-3xl font-bold text-ma-text">Checkout</h1>
      <Suspense fallback={<p className="mt-8 text-lg text-[#6b7280]">Loading...</p>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
