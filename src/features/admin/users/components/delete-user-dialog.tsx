"use client"

import { Trash2Icon } from "lucide-react"
import { ConfirmDialog } from "@/shared/ui/confirm-dialog"
import type { User } from "@/features/admin/users/types"

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (user: User) => void
  isPending: boolean
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: DeleteUserDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete User"
      heading="Delete this user?"
      description="This action is permanent and cannot be undone. The user will be removed from the system and all their data including enrollments, course progress, certificates, and purchase history will be permanently deleted."
      confirmLabel="Delete User"
      variant="destructive"
      icon={Trash2Icon}
      onConfirm={() => {
        if (user) onConfirm(user)
      }}
      isPending={isPending}
    />
  )
}
