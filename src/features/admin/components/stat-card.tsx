import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardTitle, CardContent } from "@/shared/ui/card"
import { formatCompactValue } from "@/shared/utils"

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  change: string
  icon: LucideIcon
  href?: string
}

export function StatCard({
  title,
  value,
  prefix,
  change,
  icon: Icon,
  href,
}: StatCardProps) {
  const valueNode = (
    <div className="font-semibold lg:text-4xl/[100%] 2xl:text-[40px]/[100%]">
      {formatCompactValue(value, prefix)}
    </div>
  )

  return (
    <Card
      size="sm"
      className="gap-0 rounded-[16px] border border-[#E5E7EB] py-4 shadow-none ring-0"
    >
      <CardContent className="px-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-base/[100%] font-normal text-muted-foreground">
              {title}
            </CardTitle>
            {href ? (
              <Link href={href} className="underline underline-offset-2">
                {valueNode}
              </Link>
            ) : (
              valueNode
            )}
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-ma-admin-primary/10">
            <Icon strokeWidth={1.5} className="size-5 text-ma-admin-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
