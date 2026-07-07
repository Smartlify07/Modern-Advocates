import { Check, Download } from "lucide-react"

export function PaymentSuccessContent() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-500">
        <Check className="size-8 text-white" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-ma-text">Payment Success!</h2>
        <p className="mt-1 text-3xl font-bold text-ma-text">$ 100.00</p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-[60px] bg-[#f5f5f5] px-5 py-4 text-base font-semibold text-ma-text transition-colors hover:bg-gray-200"
      >
        <Download className="size-5" />
        Get PDF Receipt
      </button>
    </div>
  )
}
