import { Check, Download } from "lucide-react"
import { TransactionDetails } from "./transaction-details"

export function PaymentSuccessContent() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-[#E7F5EC]">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#24A36D]">
            <Check className="size-6 text-white" />
          </div>
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-xl font-normal tracking-[-1.5%] text-[#6B7280] text-ma-text">
            Payment Success!
          </h2>
          <p className="mt-3 text-[30px] font-semibold text-ma-text">
            $ 100.00
          </p>
        </div>
      </div>

      <TransactionDetails />

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-[#F5F7FA] px-5 py-4 text-base font-semibold tracking-[-0.8%] text-ma-text transition-colors hover:bg-gray-200"
      >
        <Download className="size-5" />
        Get PDF Receipt
      </button>
    </div>
  )
}
