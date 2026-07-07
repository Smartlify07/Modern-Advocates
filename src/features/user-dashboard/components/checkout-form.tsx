"use client"

import { useState } from "react"
import { CreditCard, Wallet, Landmark, Check } from "lucide-react"

import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

const paymentMethods = [
  { id: "credit-card", label: "Credit Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "bank-transfer", label: "Bank Transfer", icon: Landmark },
]

export function CheckoutForm() {
  const [method, setMethod] = useState("credit-card")

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-bold tracking-[0.1em] text-[#6b7280] uppercase">
        Checkout
      </p>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-ma-text">Billing Information</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Prince Ugboaja" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="example@gmail.com" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-ma-text">Payment Method</h3>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map((pm) => {
            const selected = method === pm.id
            const Icon = pm.icon
            return (
              <button
                key={pm.id}
                type="button"
                onClick={() => setMethod(pm.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors ${
                  selected
                    ? "border-ma-text bg-white"
                    : "border-[#e5e7eb] bg-white hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`size-6 ${selected ? "text-ma-text" : "text-[#6b7280]"}`}
                />
                <span
                  className={`font-medium ${selected ? "text-ma-text" : "text-[#6b7280]"}`}
                >
                  {pm.label}
                </span>
                {selected && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-ma-text">
                    <Check className="size-3 text-white" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {method === "credit-card" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-name">Name on the card</Label>
            <Input id="card-name" placeholder="Name on the card" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-number">Card number</Label>
            <Input id="card-number" placeholder="1234567890123456" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expiry">MM / YY</Label>
              <Input id="expiry" placeholder="MM / YY" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="CVV" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
