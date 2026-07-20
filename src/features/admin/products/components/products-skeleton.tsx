import { Skeleton } from "@/shared/ui/skeleton"
import { Card, CardContent } from "@/shared/ui/card"

export function KpiSectionSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} size="sm" className="gap-0 rounded-[16px] border border-[#E5E7EB] py-4 shadow-none ring-0">
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
        <Card className="gap-0 border border-[#E5E7EB] shadow-none ring-0">
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

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-t-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="rounded-t-2xl bg-[#F5F5F5]">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="p-4">
                  <Skeleton className={`h-4 ${c === 0 ? "w-48" : c === cols - 1 ? "w-12" : "w-24"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SalesSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} size="sm" className="gap-0 rounded-[16px] border border-[#E5E7EB] py-4 shadow-none ring-0">
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

export function SearchExportSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-[44px] w-[300px] rounded-[8px]" />
      <Skeleton className="h-[44px] w-[115px] rounded-[8px]" />
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
      <TableSkeleton rows={4} cols={5} />
    </div>
  )
}
