import { Badge } from "@/shared/ui/badge"
import { cn, getStatusColor } from "@/shared/utils"

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

function titleCase(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-8 font-normal", getStatusColor(status), className)}
    >
      {label ?? titleCase(status)}
    </Badge>
  )
}