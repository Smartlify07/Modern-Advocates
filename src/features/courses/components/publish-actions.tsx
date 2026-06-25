"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Field, FieldLabel } from "@/shared/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { Calendar } from "@/shared/ui/calendar"
import { format } from "date-fns"
import {
  CalendarIcon,
  FileTextIcon,
  SendIcon,
  ClockIcon,
  Loader2,
} from "lucide-react"
import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

interface Props {
  canPublish: boolean
}

export function PublishActions({ canPublish }: Props) {
  const router = useRouter()
  const level = useCourseFormStore((s) => s.level)
  const setLevel = useCourseFormStore((s) => s.setLevel)
  const title = useCourseFormStore((s) => s.title)
  const description = useCourseFormStore((s) => s.description)
  const categoryId = useCourseFormStore((s) => s.categoryId)
  const modules = useCourseFormStore((s) => s.modules)
  const price = useCourseFormStore((s) => s.price)
  const discount = useCourseFormStore((s) => s.discount)
  const isFree = useCourseFormStore((s) => s.isFree)
  const courseId = useCourseFormStore((s) => s.courseId)
  const setCourseId = useCourseFormStore((s) => s.setCourseId)
  const isPublishing = useCourseFormStore((s) => s.isPublishing)
  const publishError = useCourseFormStore((s) => s.publishError)
  const setPublishing = useCourseFormStore((s) => s.setPublishing)
  const setPublishError = useCourseFormStore((s) => s.setPublishError)
  const resetForm = useCourseFormStore((s) => s.resetForm)

  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date>()

  const thumbnailFile = useCourseFormStore((s) => s.thumbnail)
  const thumbnailPreview = useCourseFormStore((s) => s.thumbnailPreview)

  const submitCourse = useCallback(
    async (status: "draft" | "published") => {
      setPublishing(true)
      setPublishError(null)

      try {
        const isEditing = !!courseId
        let thumbnailUrl: string | null = null

        if (thumbnailFile) {
          const uploadForm = new FormData()
          uploadForm.append("file", thumbnailFile)

          const uploadRes = await fetch("/api/upload/image", {
            method: "POST",
            body: uploadForm,
          })

          if (!uploadRes.ok) {
            throw new Error("Failed to upload thumbnail")
          }

          const uploadData = await uploadRes.json()
          thumbnailUrl = uploadData.url
        } else if (thumbnailPreview && thumbnailPreview.startsWith("http")) {
          thumbnailUrl = thumbnailPreview
        }

        const body: Record<string, unknown> = {
          title,
          description,
          categoryId,
          level,
          price: parseFloat(price) || 0,
          discountedPrice: isFree
            ? null
            : discount > 0
              ? (parseFloat(price) || 0) * (1 - discount / 100)
              : null,
          isFree,
          status,
          thumbnailUrl,
          modules: modules.map((mod, mi) => ({
            id: isEditing ? mod.id : undefined,
            title: mod.title,
            order: mod.order || mi,
            topics: mod.topics.map((topic, ti) => ({
              id: isEditing ? topic.id : undefined,
              title: topic.title,
              type: topic.type,
              description: topic.description,
              order: topic.order || ti,
            })),
          })),
        }

        const url = isEditing ? `/api/courses/${courseId}` : "/api/courses"
        const method = isEditing ? "PATCH" : "POST"

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? `Failed to ${isEditing ? "update" : "create"} course`)
        }

        if (!isEditing) {
          const course = await res.json()
          setCourseId(course.id)
        }

        resetForm()
        router.push("/admin/courses")
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to create course"
        setPublishError(msg)
      } finally {
        setPublishing(false)
      }
    },
    [
      title,
      description,
      categoryId,
      level,
      price,
      discount,
      isFree,
      modules,
      courseId,
      thumbnailFile,
      thumbnailPreview,
      setCourseId,
      setPublishing,
      setPublishError,
      resetForm,
      router,
    ],
  )

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="course-level">Course level</FieldLabel>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger id="course-level" className="w-full">
            <SelectValue placeholder="Select course level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {publishError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {publishError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={isPublishing || !canPublish}
          onClick={() => submitCourse("draft")}
        >
          {isPublishing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileTextIcon className="size-4" />
          )}
          Save as Draft
        </Button>

        <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={isPublishing}>
              <ClockIcon className="size-4" />
              {scheduleDate
                ? format(scheduleDate, "MMM d, yyyy")
                : "Schedule"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={scheduleDate}
              onSelect={(date) => {
                setScheduleDate(date)
                if (date) {
                  setScheduleOpen(false)
                }
              }}
              disabled={(d) => d <= new Date()}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => submitCourse("published")}
          disabled={isPublishing || !canPublish}
        >
          {isPublishing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <SendIcon className="size-4" />
          )}
          {isPublishing ? "Publishing..." : "Publish Now"}
        </Button>
      </div>
    </div>
  )
}
