import Link from "next/link"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/ui/table"
import { MoreHorizontalIcon, ArchiveIcon, ChartSpline } from "lucide-react"
import { ArchiveCourseDialog } from "@/app/(admin)/admin/courses/_components/archive-course-dialog"
import type { Product } from "@/features/admin/products/types"
import { apiFetch } from "@/shared/lib/api-fetch"
import { getStatusColor } from "@/shared/utils"

interface ProductTableProps { products: Product[] }

const productStatusLabels: Record<string, string> = {
  published: "Live",
  draft: "Draft",
  archived: "Archived",
}

function statusDisplay(status: string) {
  return { label: productStatusLabels[status] ?? status, class: getStatusColor(status) }
}

export function ProductTable({ products }: ProductTableProps) {
  const [archiveProduct, setArchiveProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const archiveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const endpoint = status === "archived" ? "unarchive" : "archive"
      await apiFetch(`/api/courses/${id}/${endpoint}`, { method: "PATCH" })
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
      toast.success(vars.status === "archived" ? "Product unarchived" : "Product archived")
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setArchiveProduct(null),
  })

  return (
    <>
      <div className="rounded-t-2xl">
        <Table>
          <TableHeader className="rounded-t-2xl">
            <TableRow className="rounded-t-2xl bg-ma-surface-2 hover:bg-ma-surface-2">
              <TableHead className="w-[280px]">Product</TableHead>
              <TableHead className="w-[140px]">Sales Price</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px]">Sales</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const disp = statusDisplay(product.status)
              return (
                <TableRow className="hover:bg-ma-bg" key={product.id}>
                  <TableCell><span className="font-normal">{product.name}</span></TableCell>
                  <TableCell className="text-primary">${product.salesPrice.toFixed(2)} USD</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`rounded-8 font-normal ${disp.class}`}>
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
                        <Button variant="ghost" size="icon-sm" className="size-6 rounded-full border border-ma-border-strong">
                          <MoreHorizontalIcon className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="gap-2.5 p-2" asChild>
                            <Link href={`/admin/products/sales/${product.id}`}><ChartSpline strokeWidth={1.5} className="size-4" />View Sale</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2.5 p-2" onClick={() => setArchiveProduct(product)}>
                            <ArchiveIcon strokeWidth={1.5} className="size-4" />
                            {product.status === "archived" ? "Unarchive" : "Archive"}
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
      <ArchiveCourseDialog
        open={!!archiveProduct}
        onOpenChange={(o) => { if (!o) setArchiveProduct(null) }}
        course={archiveProduct as any}
        mode={archiveProduct?.status === "archived" ? "unarchive" : "archive"}
        onConfirm={() => { if (archiveProduct) archiveMutation.mutate({ id: archiveProduct.id, status: archiveProduct.status }) }}
        isPending={archiveMutation.isPending}
      />
    </>
  )
}
