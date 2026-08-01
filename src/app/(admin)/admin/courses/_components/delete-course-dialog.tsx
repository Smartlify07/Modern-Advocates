"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Trash2Icon, Loader2Icon } from "lucide-react"
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
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Delete Course</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-red-100">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-600">
              <Trash2Icon className="size-5 text-white" />
            </div>
          </div>
          <p className="text-[30px] font-semibold">Delete this course?</p>
          <p className="text-left align-middle text-sm tracking-tight-md text-muted-foreground">
            This action cannot be undone. All modules, topics, enrollments, and
            reviews associated with this course will be permanently deleted.
          </p>
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 bg-white px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-pill flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="h-pill flex-1 rounded-button-medium px-6 py-4"
            onClick={() => {
              if (course && !isPending) onConfirm(course)
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              "Delete Course"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}