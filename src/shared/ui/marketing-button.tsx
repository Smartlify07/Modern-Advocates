import type { ComponentProps } from "react"
import { cn } from "@/shared/utils"
import { Button } from "@/shared/ui/button"

interface MarketingButtonProps extends ComponentProps<typeof Button> {
  tone?: "solid" | "outline"
}

export function MarketingButton({
  tone = "solid",
  className,
  children,
  ...props
}: MarketingButtonProps) {
  return (
    <Button
      data-slot="marketing-button"
      className={cn(
        "group relative h-pill overflow-hidden rounded-pill px-5 py-4 text-base font-semibold disabled:opacity-60",
        tone === "solid"
          ? "text-white"
          : "border-ma-text/20 bg-white text-ma-text",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2.5">
        {children}
      </span>
      <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Button>
  )
}
