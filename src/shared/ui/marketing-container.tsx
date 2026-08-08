import type { ComponentProps } from "react"
import { cn } from "@/shared/utils"

export function MarketingContainer({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="marketing-container"
      className={cn("marketing-container", className)}
      {...props}
    />
  )
}
