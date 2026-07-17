"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import {
  MoreHorizontalIcon,
  PencilIcon,
  ArchiveIcon,
  RotateCcwIcon,
} from "lucide-react"
import { CourseCard } from "@/features/courses/components/course-card"
import type { Course } from "./types"

export default function CourseCardItem({ course }: { course: Course }) {
  const router = useRouter()
  const [dialogAction, setDialogAction] = useState<
    "archive" | "unarchive" | null
  >(null)
  const isArchived = course.status === "archived"

  const action = dialogAction ?? (isArchived ? "unarchive" : "archive")

  return (
    <>
      <div className="group flex w-full flex-col gap-5 rounded-[24px] border border-[#d9d9d9] bg-white px-2.5 pt-2.5 pb-5 transition-colors duration-300 hover:bg-gray-50">
        <CourseCard.Thumbnail src={course.thumbnailUrl} alt={course.title} />
        <div className="flex flex-1 flex-col justify-between gap-4">
          <CourseCard.Content className="min-h-[64px]">
            <CourseCard.Title className="text-lg">
              {course.title}
            </CourseCard.Title>
            <CourseCard.Tutor name={course.tutorName ?? "Unknown Instructor"} />
          </CourseCard.Content>
          <div className="flex items-center justify-between px-2.5">
            {course.isFree ? (
              <span className="text-xl font-medium text-ma-text">Free</span>
            ) : (
              <CourseCard.Price
                price={course.price}
                discountedPrice={course.discountedPrice}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="ring- size-6 rounded-full border border-[#141B34]"
                >
                  <MoreHorizontalIcon className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 [&>div]:gap-2.5 [&>div]:p-2"
              >
                <DropdownMenuItem
                  className="hover:bg-[#F5F7FA]"
                  onClick={() =>
                    router.push(`/admin/courses/${course.id}/edit`)
                  }
                >
                  <PencilIcon className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#F5F7FA]"
                  onClick={() =>
                    setDialogAction(isArchived ? "unarchive" : "archive")
                  }
                >
                  {isArchived ? (
                    <RotateCcwIcon className="size-4" />
                  ) : (
                    <ArchiveIcon className="size-4" />
                  )}
                  {isArchived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog
        open={!!dialogAction}
        onOpenChange={(o) => {
          if (!o) setDialogAction(null)
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-[360px]">
          <DialogHeader className="items-center gap-3 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
              {action === "archive" ? (
                <ArchiveIcon className="size-6 text-red-600" />
              ) : (
                <RotateCcwIcon className="size-6 text-red-600" />
              )}
            </div>
            <DialogTitle className="text-center text-lg font-semibold">
              {action === "archive" ? "Archive Course" : "Unarchive Course"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {action === "archive"
                ? "This course will be archived and no longer visible to students. You can unarchive it anytime."
                : "This course will be restored and visible to students again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-none pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDialogAction(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setDialogAction(null)}
            >
              {action === "archive" ? "Archive" : "Unarchive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
