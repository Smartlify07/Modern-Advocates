"use client"

import { CircleAlertIcon } from "lucide-react"
import { ConfirmDialog } from "@/shared/ui/confirm-dialog"
import type { User } from "@/features/admin/users/types"

interface ActivateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (user: User) => void
  isPending: boolean
}

export function ActivateUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: ActivateUserDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Activate User"
      heading="Reactivate this user?"
      description="This user will regain access to their account and can sign in immediately. All previous enrollments, course progress, certificates, and purchases will be available exactly as they were before suspension."
      confirmLabel="Activate User"
      variant="primary"
      icon={CircleAlertIcon}
      onConfirm={() => {
        if (user) onConfirm(user)
      }}
      isPending={isPending}
    />
  )
}
