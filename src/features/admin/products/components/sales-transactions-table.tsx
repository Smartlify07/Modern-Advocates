"use client"

import { useRouter } from "next/navigation"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"

export interface SaleTransaction {
  id: string
  productId: string
  product: string
  customerName: string
  customerEmail: string
  date: string
  amount: number
}

interface SalesTransactionsTableProps {
  sales: SaleTransaction[]
  showProduct?: boolean
  getRowHref?: (sale: SaleTransaction) => string
}

export function SalesTransactionsTable({ sales, showProduct, getRowHref }: SalesTransactionsTableProps) {
  const router = useRouter()

  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            {showProduct && <TableHead>Product</TableHead>}
            <TableHead>Customer name</TableHead>
            <TableHead>Customer email</TableHead>
            <TableHead>Transaction Date</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((s) => (
            <TableRow
              key={s.id}
              className={getRowHref ? "cursor-pointer hover:bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]"}
              onClick={getRowHref ? () => router.push(getRowHref(s)) : undefined}
            >
              {showProduct && <TableCell className="font-normal">{s.product}</TableCell>}
              <TableCell className="font-normal">{s.customerName}</TableCell>
              <TableCell className="text-muted-foreground">{s.customerEmail}</TableCell>
              <TableCell>{s.date}</TableCell>
              <TableCell>${s.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
