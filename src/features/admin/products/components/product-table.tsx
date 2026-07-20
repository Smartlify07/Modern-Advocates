import Link from "next/link"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"
import { MoreHorizontalIcon, ArchiveIcon, ChartSpline } from "lucide-react"
import type { Product } from "@/features/admin/products/types"

interface ProductTableProps { products: Product[] }

function statusDisplay(status: string) {
  if (status === "published") return { label: "Live", class: "bg-green-700/10 text-green-700" }
  if (status === "draft") return { label: "Draft", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" }
  return { label: "Archived", class: "bg-muted text-muted-foreground" }
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead className="w-[280px]">Product</TableHead>
            <TableHead>Sales Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const disp = statusDisplay(product.status)
            return (
              <TableRow className="hover:bg-[#F5F7FA]" key={product.id}>
                <TableCell><span className="font-normal">{product.name}</span></TableCell>
                <TableCell className="text-primary">${product.salesPrice.toFixed(2)} USD</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`rounded-[8px] font-normal ${disp.class}`}>
                    {disp.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/products/sales/${product.id}`} className="cursor-pointer text-blue-600 underline underline-offset-2">
                    {product.sales}
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
                          <Link href={`/admin/products/sales/${product.id}`}><ChartSpline strokeWidth={1.5} className="size-4" />View Sale</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2.5 p-2">
                          <ArchiveIcon strokeWidth={1.5} className="size-4" />
                          Archive
                        </DropdownMenuItem>
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
