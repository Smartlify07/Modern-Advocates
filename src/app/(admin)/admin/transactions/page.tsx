"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { CreditCardIcon } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  currency: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentProvider: string | null
  stripePaymentIntentId: string | null
  source: string
  createdAt: string
  student: { id: string; name: string; email: string } | null
  course: { id: string; title: string } | null
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
}

export default function AdminTransactionsPage() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["admin-transactions"],
    queryFn: () => fetch("/api/admin/transactions").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Transactions</h1>
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
          <p className="text-muted-foreground">No transactions yet</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Stripe ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="p-4 text-muted-foreground">
                    {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{tx.student?.name ?? "—"}</span>
                      <span className="text-xs text-muted-foreground">{tx.student?.email}</span>
                    </div>
                  </td>
                  <td className="p-4 max-w-[200px] truncate">
                    {tx.course?.title ?? "—"}
                  </td>
                  <td className="p-4">
                    <span className="font-medium tabular-nums">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: tx.currency,
                      }).format(tx.amount)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[tx.paymentStatus] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      <CreditCardIcon className="size-3" />
                      {tx.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {tx.stripePaymentIntentId ? (
                      <span className="truncate block max-w-[160px]" title={tx.stripePaymentIntentId}>
                        {tx.stripePaymentIntentId}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
