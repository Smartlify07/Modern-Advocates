import { RefreshCw, X } from "lucide-react"

export function PaymentFailedContent({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-500">
        <X className="size-8 text-white" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-ma-text">Payment Failed</h2>
        <p className="mt-1 text-base text-[#6b7280]">
          Transaction could not be processed
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-red-500 px-5 py-4 text-base font-semibold text-white transition-colors hover:bg-red-600"
      >
        <RefreshCw className="size-5" />
        Retry Payment
      </button>
    </div>
  )
}
