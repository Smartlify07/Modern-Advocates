import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"
import type { Customer } from "@/features/admin/products/types"

interface CustomersTableProps { customers: Customer[] }

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead>Customer name</TableHead>
            <TableHead>Customer email</TableHead>
            <TableHead className="text-center">Courses Purchased</TableHead>
            <TableHead className="text-center">Total Spent</TableHead>
            <TableHead className="text-center">Last Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow className="hover:bg-[#F5F7FA]" key={c.id}>
              <TableCell className="font-normal">{c.name}</TableCell>
              <TableCell className="text-muted-foreground">{c.email}</TableCell>
              <TableCell className="text-center">{c.courseCount}</TableCell>
              <TableCell className="text-center font-medium">
                ${Number(c.totalSpent).toFixed(2)}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {c.lastPurchase ? new Date(c.lastPurchase).toLocaleDateString() : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
