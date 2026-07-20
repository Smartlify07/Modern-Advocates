"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import { Card, CardContent } from "@/shared/ui/card"
import { DateFilter } from "./date-filter"
import { SalesChart } from "./sales-chart"
import { ProductEarningsCard } from "./product-earnings-card"
import { periodFromDateOption, type ChartDataPoint, type SalesSummary } from "@/features/admin/products/types"

function EarningsSkeleton() {
  return (
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
  )
}

function ChartSkeleton() {
  return (
    <Card className="lg:col-span-2">
      <CardContent>
        <Skeleton className="h-[204px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function SalesSection() {
  const [selectedDate, setSelectedDate] = useState("Last 7 Days")
  const period = periodFromDateOption(selectedDate)

  const { data: chartData = [], isLoading: chartLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ["admin-sales-stats", period],
    queryFn: () => fetch(`/api/admin/sales/stats?period=${period}`).then((r) => r.json()),
  })

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Sales</h2>
        <DateFilter value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {chartLoading ? <EarningsSkeleton /> : <ProductEarningsCard totalRevenue={totalRevenue} periodLabel={selectedDate} />}
        {chartLoading ? <ChartSkeleton /> : <SalesChart data={chartData} />}
      </div>
    </div>
  )
}
