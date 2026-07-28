import { Check, Download, Loader2 } from "lucide-react"
import { TransactionDetails } from "./transaction-details"
import type { TransactionDetailsData } from "@/features/user-dashboard/types/checkout"

export function PaymentSuccessContent({
  amount,
  polling,
  transactionDetails,
  onRedirect,
}: {
  amount: string
  polling: boolean
  transactionDetails: TransactionDetailsData | null
  onRedirect?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-[#E7F5EC]">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#24A36D]">
            {polling ? (
              <Loader2 className="size-6 animate-spin text-white" />
            ) : (
              <Check className="size-6 text-white" />
            )}
          </div>
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-xl font-normal tracking-[-1.5%] text-[#6B7280] text-ma-text">
            Payment Successful!
          </h2>
          <p className="mt-3 text-[30px] font-semibold text-ma-text">{amount}</p>

          {polling && (
            <p className="mt-4 text-sm text-[#6b7280]">
              We're preparing your course access...
            </p>
          )}
        </div>
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

      {onRedirect && (
        <button
          type="button"
          onClick={onRedirect}
          className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-[#F5F7FA] px-5 py-4 text-base font-semibold tracking-[-0.8%] text-ma-text transition-colors hover:bg-gray-200"
        >
          <Download className="size-5" />
          Go to My Learning
        </button>
      )}
    </div>
  )
}
