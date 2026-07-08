import { RefreshCw, X } from "lucide-react"
import { TransactionDetails } from "./transaction-details"

export function PaymentFailedContent({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex size-20 items-center justify-center rounded-full bg-[#FEE2E1]">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#F62323]">
          <X className="size-8 text-white" />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-ma-text">Payment Failed</h2>
        <p className="mt-3 text-base tracking-[-1.5%] text-[#6b7280]">
          Transaction could not be processed
        </p>
      </div>

      <TransactionDetails />

      <button
        type="button"
        onClick={onRetry}
        className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-[#F62323] px-6 py-4 text-base font-medium tracking-[-0.8%] text-white transition-colors"
      >
        <RefreshCw className="size-5" />
        Retry Payment
      </button>
    </div>
  )
}
