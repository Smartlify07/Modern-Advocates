"use client"

import {
  AlertTriangleIcon,
  CircleAlertIcon,
  Loader2Icon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/utils"

type ConfirmVariant = "destructive" | "warning" | "primary"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  heading: string
  description?: React.ReactNode
  confirmLabel: string
  onConfirm: () => void
  isPending?: boolean
  variant?: ConfirmVariant
  icon?: LucideIcon
  preventCloseWhilePending?: boolean
  footerClassName?: string
  confirmButtonClassName?: string
}

const variantStyles: Record<
  ConfirmVariant,
  { iconOuter: string; iconInner: string; confirmButton: string }
> = {
  destructive: {
    iconOuter: "bg-destructive/10",
    iconInner: "bg-destructive",
    confirmButton: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
  warning: {
    iconOuter: "bg-ma-warning/10",
    iconInner: "bg-ma-warning",
    confirmButton: "bg-ma-warning text-white hover:bg-ma-warning/80",
  },
  primary: {
    iconOuter: "bg-ma-admin-primary/10",
    iconInner: "bg-ma-admin-primary",
    confirmButton: "bg-ma-admin-primary text-white hover:bg-ma-admin-primary/80",
  },
}

const defaultIcon: Record<ConfirmVariant, LucideIcon> = {
  destructive: Trash2Icon,
  warning: AlertTriangleIcon,
  primary: CircleAlertIcon,
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  heading,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  variant = "destructive",
  icon: Icon = defaultIcon[variant],
  preventCloseWhilePending = false,
  footerClassName,
  confirmButtonClassName,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant]

  const handleOpenChange = (next: boolean) => {
    if (preventCloseWhilePending && isPending && !next) return
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className={cn("flex size-20 items-center justify-center rounded-full", styles.iconOuter)}>
            <div className={cn("flex size-10 items-center justify-center rounded-full", styles.iconInner)}>
              <Icon className="size-5 text-white" />
            </div>
          </div>
          <p className="text-[30px] font-semibold">{heading}</p>
          {description && (
            <p className="text-left align-middle text-sm tracking-tight-md text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <DialogFooter className={cn("-mx-7.5 border-t-0 px-7.5 pb-4 sm:justify-start", footerClassName)}>
          <Button
            variant="outline"
            className="h-pill flex-1 rounded-button-medium px-6 py-4"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "h-pill flex-1 rounded-button-medium px-6 py-4",
              confirmButtonClassName ?? styles.confirmButton
            )}
            onClick={() => {
              if (!isPending) onConfirm()
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
