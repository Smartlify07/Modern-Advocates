import { Skeleton } from "@/shared/ui/skeleton"
import { cn } from "@/shared/utils"
import { TableSkeleton, type TableSkeletonColumn } from "@/shared/ui/table-skeleton"

interface DataTableSkeletonProps {
  columns: TableSkeletonColumn[]
  rows?: number
  showToolbar?: boolean
  toolbarClassName?: string
  className?: string
}

export function DataTableSkeleton({
  columns,
  rows = 5,
  showToolbar = true,
  toolbarClassName,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showToolbar && (
        <div className={cn("flex items-center justify-between", toolbarClassName)}>
          <Skeleton className="h-11 w-[300px] rounded-8" />
          <Skeleton className="h-11 w-[115px] rounded-8" />
        </div>
      )}
      <TableSkeleton columns={columns} rows={rows} />
    </div>
  )
}