"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  buildCoursePayload,
  uploadThumbnail,
  uploadCourseVideos,
  type CreateCoursePayload,
  type UpdateCoursePayload,
  type CourseResponse,
} from "@/features/courses/api/course-service"
import { useVideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { VideoUploadToast } from "@/features/courses/components/video-upload-toast"
import type { CourseStatus } from "@/features/courses/types"
import type { CourseWizardStore } from "@/features/courses/store/use-course-wizard-store"

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload): Promise<CourseResponse> => {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to create course")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      courseId,
      payload,
    }: {
      courseId: string
      payload: UpdateCoursePayload
    }): Promise<CourseResponse> => {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to update course")
      }
      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] })
    },
  })
}

interface SaveCourseOptions {
  status: CourseStatus
  onSuccess?: (result: CourseResponse) => void
  courseId?: string
  toastMessage?: string
}

function showVideoUploadToast() {
  const toastId = toast.custom(
    () => <VideoUploadToast onClose={() => toast.dismiss(toastId)} />,
    { duration: Infinity }
  )
  return { dismiss: () => toast.dismiss(toastId) }
}

export function useSaveCourse() {
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()

  return useMutation({
    mutationFn: async ({
      store,
      options,
    }: {
      store: CourseWizardStore
      options: SaveCourseOptions
    }): Promise<CourseResponse> => {
      let thumbnailUrl: string | undefined
      let instructorImageUrl: string | null = null

      if (store.thumbnail instanceof File) {
        thumbnailUrl = await uploadThumbnail(store.thumbnail)
      }
      if (store.instructorPhoto instanceof File) {
        instructorImageUrl = await uploadThumbnail(store.instructorPhoto)
      }

      const isNew = !store.courseId && !options.courseId
      const payload = buildCoursePayload(store, thumbnailUrl, options.status, instructorImageUrl)

      if (isNew) {
        return await createCourse.mutateAsync(payload as CreateCoursePayload)
      } else {
        const courseId = store.courseId ?? options.courseId!
        return await updateCourse.mutateAsync({ courseId, payload })
      }
    },
    onSuccess: (result, { store, options }) => {
      toast.success(options.toastMessage ?? (
        options.status === "published"
          ? "Course published successfully"
          : "Saved to your drafts"
      ))

      if (
        result &&
        store.modules.some((m) => m.topics.some((t) => t.videoFile))
      ) {
        const videoStore = useVideoUploadStore.getState()

        const moduleMap = new Map<string, string>()
        const topicMap = new Map<string, string>()
        for (const mod of result.modules) {
          moduleMap.set(mod.clientId, mod.id)
          for (const topic of mod.topics) {
            topicMap.set(topic.clientId, topic.id)
          }
        }

        useVideoUploadStore.getState().clearAll()
        const uploadToast = showVideoUploadToast()

        const uploads = uploadCourseVideos(
          store.modules,
          moduleMap,
          topicMap,
          result.id,
          store.title,
          videoStore,
        )

        if (uploads.length === 0) {
          uploadToast.dismiss()
          return
        }

        Promise.allSettled(uploads).then((results) => {
          const allDone = results.every((r) => r.status === "fulfilled")
          if (allDone) {
            uploadToast.dismiss()
            toast.success("All videos uploaded")
          } else {
            uploadToast.dismiss()
            showVideoUploadToast()
          }
        })
      }

      options.onSuccess?.(result)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    },
  })
}
