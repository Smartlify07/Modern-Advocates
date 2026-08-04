"use client"

import { ArchiveIcon, RotateCcwIcon } from "lucide-react"
import { ConfirmDialog } from "@/shared/ui/confirm-dialog"
import type { Course } from "./types"

interface ArchiveCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  mode: "archive" | "unarchive"
  onConfirm: (course: Course) => void
  isPending: boolean
}

export function ArchiveCourseDialog({
  open,
  onOpenChange,
  course,
  mode,
  onConfirm,
  isPending,
}: ArchiveCourseDialogProps) {
  const isArchive = mode === "archive"
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isArchive ? "Archive Course" : "Unarchive Course"}
      heading={isArchive ? "Archive this course?" : "Unarchive this course?"}
      description={
        isArchive
          ? "This course will be archived and no longer visible to students. You can unarchive it anytime."
          : "This course will be restored and visible to students again."
      }
      confirmLabel={isArchive ? "Archive Course" : "Unarchive Course"}
      variant="warning"
      icon={isArchive ? ArchiveIcon : RotateCcwIcon}
      footerClassName="bg-white"
      preventCloseWhilePending
      onConfirm={() => {
        if (course) onConfirm(course)
      }}
      isPending={isPending}
    />
  )
}
