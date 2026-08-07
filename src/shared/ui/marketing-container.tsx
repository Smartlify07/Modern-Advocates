import type { ComponentProps } from "react"
import { cn } from "@/shared/utils"

export function MarketingContainer({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="marketing-container"
      className={cn(
        "mx-auto px-4 lg:max-w-7xl lg:px-25 2xl:max-w-360",
        className
      )}
      {...props}
    />
  )
}
