"use client"

import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/shared/ui/card"
import { DateFilter } from "./date-filter"
import { SalesChart } from "./sales-chart"
import { ProductEarningsCard } from "./product-earnings-card"

export function SalesSection() {
  const [selectedDate, setSelectedDate] = useState("Last 7 Days")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Sales</h2>
        <DateFilter value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ProductEarningsCard />

        <SalesChart />
      </div>
    </div>
  )
}
