import { RefreshCw, X } from "lucide-react"
import { TransactionDetails } from "./transaction-details"

export function PaymentFailedContent({
  mode,
  message,
  onRetry,
}: {
  mode: "payment" | "enrollment"
  message?: string | null
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex size-20 items-center justify-center rounded-full bg-[#FEE2E1]">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#F62323]">
          <X className="size-8 text-white" />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-ma-text">
          {mode === "payment" ? "Payment Failed" : "Enrollment Failed"}
        </h2>
        <p className="mt-3 text-base tracking-[-1.5%] text-[#6b7280]">
          {message ?? (mode === "payment"
            ? "Transaction could not be processed"
            : "Could not complete enrollment")}
        </p>
      </div>

      <TransactionDetails
        referenceNumber="000085752257"
        date="Mar 22, 2023"
        time="07:15 AM"
        paymentMethod="Credit Card"
        amount="$ 100.00"
      />

      <button
        type="button"
        onClick={onRetry}
        className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-[#F62323] px-6 py-4 text-base font-medium tracking-[-0.8%] text-white transition-colors"
      >
        <RefreshCw className="size-5" />
        {mode === "payment" ? "Retry Payment" : "Retry Enrollment"}
      </button>
    </div>
  )
}
