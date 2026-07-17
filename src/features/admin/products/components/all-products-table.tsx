import Link from "next/link"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"
import { MoreHorizontalIcon, ChartSpline, ArchiveIcon } from "lucide-react"
import type { Product } from "@/features/admin/products/types"

interface AllProductsTableProps { products: Product[] }

export function AllProductsTable({ products }: AllProductsTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead>Product</TableHead>
            <TableHead className="text-center">Sales Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Sales</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow className="hover:bg-[#F5F7FA]" key={p.id}>
              <TableCell className="font-normal">{p.name}</TableCell>
              <TableCell className="text-center text-primary">${p.salesPrice.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className={p.status === "live" ? "rounded-[8px] bg-green-700/10 font-normal text-green-700" : "rounded-[8px] bg-muted font-normal text-muted-foreground"}>
                  {p.status === "live" ? "Live" : "Archived"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Link href={`/admin/products/sales/${p.id}`} className="text-blue-600 underline underline-offset-2">
                  {p.sales}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="size-6 rounded-full border border-[#141B34]">
                      <MoreHorizontalIcon className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="gap-2.5 p-2" asChild>
                        <Link href={`/admin/products/sales/${p.id}`}><ChartSpline strokeWidth={1.5} className="size-4" />View Sale</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5 p-2"><ArchiveIcon strokeWidth={1.5} className="size-4" />Archive</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
