import { Card, CardContent, CardTitle } from "@/shared/ui/card"

interface ProductEarningsCardProps {
  totalRevenue: number
  periodLabel: string
}

export function ProductEarningsCard({ totalRevenue, periodLabel }: ProductEarningsCardProps) {
  return (
    <Card className="gap-0 border border-[#E5E7EB] shadow-none ring-0">
      <CardContent className="flex flex-col gap-13 px-4">
        <CardTitle className="text-base font-medium">
          Product Earnings
        </CardTitle>
        <div className="flex flex-col gap-1">
          <span className="text-5xl font-medium lg:text-[64px]">
            ${totalRevenue.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-ma-admin-primary">
            {periodLabel}
          </span>
        </div>
        <span className="text-base text-muted-foreground">
          currency: <strong className="font-medium text-primary">USD</strong>
        </span>
      </CardContent>
    </Card>
  )
}
