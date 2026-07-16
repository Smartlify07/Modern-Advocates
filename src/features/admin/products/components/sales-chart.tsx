"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart"

export const description = "A linear area chart"

const chartData = [
  { day: "Mon", sales: 100 },
  { day: "Tue", sales: 20 },
  { day: "Wed", sales: 80 },
  { day: "Thu", sales: 50 },
  { day: "Fri", sales: 40 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--ma-admin-primary)",
  },
} satisfies ChartConfig

export function SalesChart() {
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
