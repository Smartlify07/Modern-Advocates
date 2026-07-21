"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { ArchiveIcon, RotateCcwIcon, Loader2Icon } from "lucide-react"
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
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) onOpenChange(o) }}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">
            {mode === "archive" ? "Archive Course" : "Unarchive Course"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-[#A38524]/10">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#A38524]">
              {mode === "archive" ? (
                <ArchiveIcon className="size-5 text-white" />
              ) : (
                <RotateCcwIcon className="size-5 text-white" />
              )}
            </div>
          </div>
          <p className="text-[30px] font-semibold">
            {mode === "archive"
              ? "Archive this course?"
              : "Unarchive this course?"}
          </p>
          <p className="text-left align-middle text-sm tracking-[-1.5%] text-muted-foreground">
            {mode === "archive"
              ? "This course will be archived and no longer visible to students. You can unarchive it anytime."
              : "This course will be restored and visible to students again."}
          </p>
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 bg-white px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="h-[53px] flex-1 rounded-button-medium bg-[#A38524] px-6 py-4 text-white hover:bg-[#A38524]/80"
            onClick={() => {
              if (course && !isPending) onConfirm(course)
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : mode === "archive" ? (
              "Archive Course"
            ) : (
              "Unarchive Course"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
