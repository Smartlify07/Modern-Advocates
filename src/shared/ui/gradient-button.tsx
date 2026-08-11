import type { ComponentProps } from "react"
import Link from "next/link"
import { cn } from "@/shared/utils"
import { Button } from "@/shared/ui/button"

interface GradientButtonProps extends ComponentProps<typeof Button> {
  href?: string
}

export function GradientButton({
  href,
  className,
  children,
  ...props
}: GradientButtonProps) {
  const content = (
    <>
      <span className="relative z-10 inline-flex items-center justify-center gap-2.5">
        {children}
      </span>
      <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </>
  )

  const buttonClassName = cn(
    "group relative overflow-hidden rounded-pill hover:[&>svg]:rotate-30",
    className
  )

  if (href) {
    return (
      <Button asChild className={buttonClassName} {...props}>
        <Link href={href}>{content}</Link>
      </Button>
    )
  }

  return (
    <Button className={buttonClassName} {...props}>
      {content}
    </Button>
  )
}
