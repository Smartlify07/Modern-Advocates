type TransactionDetailsProps = {
  referenceNumber: string
  date: string
  time: string
  paymentMethod: string
  amount: string
}

export function TransactionDetails({
  referenceNumber,
  date,
  time,
  paymentMethod,
  amount,
}: TransactionDetailsProps) {
  const details = [
    { label: "Reference Number", value: referenceNumber },
    { label: "Date", value: date },
    { label: "Time", value: time },
    { label: "Payment Method", value: paymentMethod },
    { label: "Amount", value: amount },
  ]

  return (
    <div className="flex w-full shrink-0 flex-col gap-6">
      {details.map((row) => (
        <div key={row.label} className="flex justify-between text-sm">
          <span className="text-[#6b7280]">{row.label}</span>
          <span className="font-medium text-ma-text">{row.value}</span>
        </div>
      ))}
    </div>
  )
}
