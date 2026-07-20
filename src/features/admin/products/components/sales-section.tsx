"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardTitle } from "@/shared/ui/card"
import { DateFilter } from "./date-filter"
import { SalesChart } from "./sales-chart"
import { ProductEarningsCard } from "./product-earnings-card"
import { periodFromDateOption, type ChartDataPoint, type SalesSummary } from "@/features/admin/products/types"

export function SalesSection() {
  const [selectedDate, setSelectedDate] = useState("Last 7 Days")
  const period = periodFromDateOption(selectedDate)

  const { data: chartData = [] } = useQuery<ChartDataPoint[]>({
    queryKey: ["admin-sales-stats", period],
    queryFn: () => fetch(`/api/admin/sales/stats?period=${period}`).then((r) => r.json()),
  })

  const { data: salesData } = useQuery<{ sales: any[]; summary: SalesSummary }>({
    queryKey: ["admin-sales", period],
    queryFn: () => fetch(`/api/admin/sales?period=${period}`).then((r) => r.json()),
  })

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Sales</h2>
        <DateFilter value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ProductEarningsCard totalRevenue={totalRevenue} periodLabel={selectedDate} />
        <SalesChart data={chartData} />
      </div>
    </div>
  )
}
