"use client"

import { CircleAlertIcon } from "lucide-react"
import { ConfirmDialog } from "@/shared/ui/confirm-dialog"
import type { User } from "@/features/admin/users/types"

interface SuspendUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (user: User) => void
  isPending: boolean
}

export function SuspendUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: SuspendUserDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Suspend User"
      heading="Suspend this user?"
      description="This user will no longer be able to sign in or access their account. Their profile, enrollments, course progress, certificates, and purchase history will be preserved. You can reactivate this account at any time."
      confirmLabel="Suspend User"
      variant="warning"
      icon={CircleAlertIcon}
      confirmButtonClassName="bg-ma-warning-bg text-ma-warning hover:bg-ma-warning hover:text-white"
      onConfirm={() => {
        if (user) onConfirm(user)
      }}
      isPending={isPending}
    />
  )
}
