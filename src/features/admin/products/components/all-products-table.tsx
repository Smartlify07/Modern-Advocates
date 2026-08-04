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
import { getStatusColor } from "@/shared/utils"

interface AllProductsTableProps { products: Product[] }

const productStatusLabels: Record<string, string> = {
  published: "Live",
  draft: "Draft",
  archived: "Archived",
}

function statusDisplay(status: string) {
  return { label: productStatusLabels[status] ?? status, class: getStatusColor(status) }
}

export function AllProductsTable({ products }: AllProductsTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-ma-surface-2 hover:bg-ma-surface-2">
            <TableHead className="w-[280px]">Product</TableHead>
            <TableHead className="w-[120px] text-center">Sales Price</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[80px] text-center">Sales</TableHead>
            <TableHead className="w-[80px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => {
            const disp = statusDisplay(p.status)
            return (
              <TableRow className="hover:bg-ma-bg" key={p.id}>
                <TableCell className="font-normal">{p.name}</TableCell>
                <TableCell className="text-center text-primary">${p.salesPrice.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className={`rounded-8 font-normal ${disp.class}`}>
                    {disp.label}
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
                      <Button variant="ghost" size="icon-sm" className="size-6 rounded-full border border-ma-border-strong">
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
