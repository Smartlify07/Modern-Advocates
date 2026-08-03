import { Skeleton } from "@/shared/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { cn } from "@/shared/utils"

export interface TableSkeletonColumn {
  label?: string
  headClassName?: string
  skeletonClassName?: string
  center?: boolean
}

interface TableSkeletonProps {
  columns: TableSkeletonColumn[]
  rows?: number
  headerClassName?: string
  rowClassName?: string
}

export function TableSkeleton({
  columns,
  rows = 5,
  headerClassName = "rounded-t-2xl",
  rowClassName = "rounded-t-2xl bg-ma-surface-2 hover:bg-ma-surface-2",
}: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader className={headerClassName}>
        <TableRow className={rowClassName}>
          {columns.map((col, i) => (
            <TableHead key={i} className={col.headClassName}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, r) => (
          <TableRow key={r}>
            {columns.map((col, c) => (
              <TableCell key={c} className={cn(col.center && "text-center")}>
                <Skeleton
                  className={cn("h-6 w-32", col.center && "mx-auto", col.skeletonClassName)}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}