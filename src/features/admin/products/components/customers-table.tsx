import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"

export interface Customer {
  id: string
  name: string
  email: string
}

interface CustomersTableProps { customers: Customer[] }

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead className="w-[280px]">Customer name</TableHead>
            <TableHead className="w-[320px]">Customer email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow className="hover:bg-[#F5F7FA]" key={c.id}>
              <TableCell className="font-normal">{c.name}</TableCell>
              <TableCell className="text-muted-foreground">{c.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
