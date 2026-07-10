import { Check, Download, Loader2 } from "lucide-react"
import { TransactionDetails } from "./transaction-details"

export function PaymentSuccessContent({
  amount,
  polling,
  onRedirect,
}: {
  amount: string
  polling: boolean
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

      <TransactionDetails
        referenceNumber="000085752257"
        date="Mar 22, 2023"
        time="07:15 AM"
        paymentMethod="Credit Card"
        amount={amount}
      />

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
