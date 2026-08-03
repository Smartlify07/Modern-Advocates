import { Skeleton } from "@/shared/ui/skeleton"
import { Card, CardContent } from "@/shared/ui/card"
import { TableSkeleton } from "@/shared/ui/table-skeleton"

export function KpiSectionSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} size="sm" className="gap-0 rounded-[16px] border border-border py-4 shadow-none ring-0">
          <CardContent className="px-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-16" />
              </div>
              <Skeleton className="size-10 rounded-[10px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SalesSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-11 w-36 rounded-(--radius-button-medium)" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-0 border border-border shadow-none ring-0">
          <CardContent className="flex flex-col gap-13 px-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-28" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent>
            <Skeleton className="h-[204px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function SalesSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} size="sm" className="gap-0 rounded-[16px] border border-border py-4 shadow-none ring-0">
          <CardContent className="px-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
              <Skeleton className="size-10 rounded-[10px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ProductListSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-5 w-12" />
      </div>
      <TableSkeleton
        columns={[
          { label: "Product", headClassName: "w-[280px]", skeletonClassName: "w-48" },
          { label: "Sales Price", headClassName: "w-[140px]", skeletonClassName: "w-20" },
          { label: "Status", headClassName: "w-[100px]", skeletonClassName: "w-20" },
          { label: "Sales", headClassName: "w-[80px]", skeletonClassName: "w-12" },
          { label: "Actions", headClassName: "w-[80px] text-center", center: true, skeletonClassName: "size-6 rounded-full" },
        ]}
      />
    </div>
  )
}
