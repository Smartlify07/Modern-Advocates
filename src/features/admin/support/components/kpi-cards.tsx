import { MessageCircleMore } from "lucide-react"
import { Card, CardTitle, CardContent } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

interface KpiCardsProps {
  totalTickets: number
  open: number
  pending: number
  resolved: number
  isLoading?: boolean
}

const kpiData = [
  {
    label: "Total Tickets",
    value: "totalTickets" as const,
    bg: "bg-[#E4E0F2] text-ma-admin-primary",
  },
  { label: "Open", value: "open" as const, bg: "bg-[#E0E9F2] text-[#448AFF]" },
  {
    label: "Pending",
    value: "pending" as const,
    bg: "bg-amber-100 text-amber-600",
  },
  {
    label: "Resolved",
    value: "resolved" as const,
    bg: "bg-[#E0F2E1] text-[#2E7D32]",
  },
]

export function KpiCards({
  totalTickets,
  open,
  pending,
  resolved,
  isLoading,
}: KpiCardsProps) {
  const values = { totalTickets, open, pending, resolved }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card
          key={kpi.label}
          size="sm"
          className="gap-0 rounded-[16px] border border-[#E5E7EB] py-4 shadow-none ring-0"
        >
          <CardContent className="px-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <CardTitle className="text-base/[100%] font-normal text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <div className="mt-1 font-semibold lg:text-4xl/[100%] 2xl:text-[40px]/[100%]">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    values[kpi.value]
                  )}
                </div>
              </div>
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-[10px] ${kpi.bg}`}
              >
                <MessageCircleMore strokeWidth={1.5} className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
