import { Card, CardContent, CardTitle } from "@/shared/ui/card"
import { TrendingUp, ShoppingBag } from "lucide-react"

export function SalesSummaryCards({ sales, volume }: { sales: number; volume: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card size="sm" className="gap-0 rounded-[16px] border border-[#E5E7EB] py-4 shadow-none ring-0">
        <CardContent className="px-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-normal text-muted-foreground">Total Sales</CardTitle>
              <span className="font-semibold lg:text-4xl 2xl:text-[40px]">{sales}</span>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-ma-admin-primary/10">
              <TrendingUp strokeWidth={1.5} className="size-5 text-ma-admin-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card size="sm" className="gap-0 rounded-[16px] border border-[#E5E7EB] py-4 shadow-none ring-0">
        <CardContent className="px-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-normal text-muted-foreground">Total Volume</CardTitle>
              <span className="font-semibold lg:text-4xl 2xl:text-[40px]">${volume.toLocaleString()}</span>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-ma-admin-primary/10">
              <ShoppingBag strokeWidth={1.5} className="size-5 text-ma-admin-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
