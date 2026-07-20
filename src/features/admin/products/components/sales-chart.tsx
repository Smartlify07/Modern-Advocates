"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart"
import type { ChartDataPoint } from "@/features/admin/products/types"

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--ma-admin-primary)",
  },
} satisfies ChartConfig

interface SalesChartProps {
  data: ChartDataPoint[]
}

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="min-h-[42px] py-0">
          <CardTitle className="text-base">No. of Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[204px] items-center justify-center text-sm text-muted-foreground">
            No sales yet — the chart will appear once there are sales.
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({
    day: (([y, m, d]) => new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))(d.date.split("-").map(Number)),
    sales: d.sales,
  }))

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="min-h-[42px] py-0">
        <CardTitle className="text-base">No. of Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[204px] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 0,
            }}
            className="w-full"
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <defs>
              <linearGradient id="fillSalesChart" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ma-admin-primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ma-admin-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="linear"
              dataKey="sales"
              stroke="var(--color-ma-admin-primary)"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="url(#fillSalesChart)"
              animationBegin={400}
              animationDuration={1100}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
