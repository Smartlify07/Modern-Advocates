const details = [
  { label: "Reference Number", value: "000085752257" },
  { label: "Date", value: "Mar 22, 2023" },
  { label: "Time", value: "07:15 AM" },
  { label: "Payment Method", value: "Credit Card" },
  { label: "Amount", value: "$ 100.00" },
]

export function TransactionDetails() {
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
