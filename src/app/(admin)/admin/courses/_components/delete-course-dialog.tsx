"use client"

import { Trash2Icon } from "lucide-react"
import { ConfirmDialog } from "@/shared/ui/confirm-dialog"
import type { Course } from "./types"

interface DeleteCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onConfirm: (course: Course) => void
  isPending: boolean
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  course,
  onConfirm,
  isPending,
}: DeleteCourseDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Course"
      heading="Delete this course?"
      description="This action cannot be undone. All modules, topics, enrollments, and reviews associated with this course will be permanently deleted."
      confirmLabel="Delete Course"
      variant="destructive"
      icon={Trash2Icon}
      footerClassName="bg-white"
      preventCloseWhilePending
      onConfirm={() => {
        if (course) onConfirm(course)
      }}
      isPending={isPending}
    />
  )
}
