import { RefreshCw, X } from "lucide-react"
import { TransactionDetails } from "./transaction-details"
import type { TransactionDetailsData } from "@/features/user-dashboard/types/checkout"

export function PaymentFailedContent({
  mode,
  title,
  description,
  transactionDetails,
  onRetry,
}: {
  mode: "payment" | "enrollment"
  title?: string | null
  description?: string | null
  transactionDetails?: TransactionDetailsData | null
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive">
          <X className="size-8 text-white" />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-ma-text">
          {title ?? (mode === "payment" ? "Payment Failed" : "Enrollment Failed")}
        </h2>
        <p className="mt-3 text-base tracking-tight-md text-muted-foreground">
          {description ?? (mode === "payment"
            ? "Transaction could not be processed"
            : "Could not complete enrollment")}
        </p>
      </div>

      {transactionDetails && (
        <TransactionDetails
          referenceNumber={transactionDetails.referenceNumber}
          date={transactionDetails.date}
          time={transactionDetails.time}
          paymentMethod={transactionDetails.paymentMethod}
          amount={transactionDetails.amount}
        />
      )}

      <button
        type="button"
        onClick={onRetry}
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-destructive px-6 py-4 text-base font-medium tracking-[-0.8%] text-white transition-colors"
      >
        <RefreshCw className="size-5" />
        {mode === "payment" ? "Retry Payment" : "Retry Enrollment"}
      </button>
    </div>
  )
}
