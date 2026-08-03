import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeftIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/shared/utils"

interface PageHeaderProps {
  title: string
  icon?: LucideIcon
  backHref?: string
  action?: ReactNode
  className?: string
  titleClassName?: string
}

export function PageHeader({
  title,
  icon: Icon,
  backHref,
  action,
  className,
  titleClassName,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} aria-label="Go back">
            <ArrowLeftIcon className="size-5 cursor-pointer text-muted-foreground" />
          </Link>
        )}
        {Icon && <Icon className="size-6 text-muted-foreground" />}
        <h1 className={cn("text-4xl leading-none font-semibold tracking-tight-lg", titleClassName)}>
          {title}
        </h1>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}