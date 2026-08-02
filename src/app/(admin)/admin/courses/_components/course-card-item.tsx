"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  MoreHorizontalIcon,
  PencilIcon,
  ArchiveIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"
import { CourseCard } from "@/features/courses/components/course-card"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { ArchiveCourseDialog } from "./archive-course-dialog"
import { DeleteCourseDialog } from "./delete-course-dialog"
import type { Course } from "./types"

export default function CourseCardItem({ course }: { course: Course }) {
  const router = useRouter()
  const [dialogAction, setDialogAction] = useState<
    "archive" | "unarchive" | "delete" | null
  >(null)
  const isArchived = course.status === "archived"

  const queryClient = useQueryClient()

  const archiveMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/courses/${course.id}/archive`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      toast.success("Course archived")
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses })
    },
    onError: (err) => {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : "Failed to archive course"
      )
    },
    onSettled: () => setDialogAction(null),
  })

  const unarchiveMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/courses/${course.id}/unarchive`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      toast.success("Course unarchived")
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses })
    },
    onError: (err) => {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : "Failed to unarchive course"
      )
    },
    onSettled: () => setDialogAction(null),
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Course deleted")
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses })
    },
    onError: (err) => {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : "Failed to delete course"
      )
    },
    onSettled: () => setDialogAction(null),
  })

  const mode = dialogAction ?? (isArchived ? "unarchive" : "archive")
  const isPending =
    mode === "archive"
      ? archiveMutation.isPending
      : mode === "unarchive"
        ? unarchiveMutation.isPending
        : deleteMutation.isPending

  return (
    <>
      <div className="group flex w-full flex-col gap-5 rounded-card-2 border border-ma-border-light bg-white px-2.5 pt-2.5 pb-5 transition-colors duration-300 hover:bg-gray-50">
        <CourseCard.Thumbnail src={course.thumbnailUrl} alt={course.title || "Untitled"} />
        <div className="flex flex-1 flex-col justify-between gap-4">
          <CourseCard.Content className="min-h-[64px]">
            <CourseCard.Title className="text-lg">
              {course.title || "Untitled"}
            </CourseCard.Title>
            <CourseCard.Tutor
              name={course.instructorName || "Instructor name"}
            />
          </CourseCard.Content>
          <div className="flex items-center justify-between px-2.5">
            {course.status === "draft" ? (
              <p className="text-sm font-medium text-muted-foreground">In Draft</p>
            ) : course.status === "archived" ? (
              <p className="text-sm font-medium text-muted-foreground">Archived</p>
            ) : course.isFree ? (
              <span className="text-xl font-medium text-ma-text">Free</span>
            ) : (
              <div className="flex flex-wrap items-baseline gap-2.5 leading-normal font-medium">
                {course.discountedPrice && (
                  <CourseCard.DiscountedPrice
                    className="text-sm"
                    discountedPrice={course.discountedPrice}
                  />
                )}
                <CourseCard.DisplayPrice
                  className="text-xs"
                  displayPrice={course.price}
                />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="ring- size-6 rounded-full border border-ma-border-strong"
                >
                  <MoreHorizontalIcon className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 [&>div]:gap-2.5 [&>div]:p-2"
              >
                <DropdownMenuItem
                  className="hover:bg-ma-bg"
                  onClick={() =>
                    router.push(`/admin/courses/${course.id}/edit`)
                  }
                >
                  <PencilIcon className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-ma-bg"
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
                <DropdownMenuItem
                  onClick={() => setDialogAction("delete")}
                  variant="destructive"
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ArchiveCourseDialog
        open={dialogAction === "archive" || dialogAction === "unarchive"}
        onOpenChange={(o) => {
          if (!o) setDialogAction(null)
        }}
        course={course}
        mode={mode === "archive" ? "archive" : "unarchive"}
        onConfirm={() => {
          if (mode === "archive") {
            archiveMutation.mutate()
          } else {
            unarchiveMutation.mutate()
          }
        }}
        isPending={isPending}
      />

      <DeleteCourseDialog
        open={dialogAction === "delete"}
        onOpenChange={(o) => {
          if (!o) setDialogAction(null)
        }}
        course={course}
        onConfirm={() => deleteMutation.mutate()}
        isPending={isPending}
      />
    </>
  )
}
