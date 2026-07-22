"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  buildCoursePayload,
  uploadThumbnail,
  getCourse,
  uploadCourseVideos,
  type CreateCoursePayload,
  type UpdateCoursePayload,
  type CourseResponse,
} from "@/features/courses/api/course-service"
import { useVideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { VideoUploadToast } from "@/features/courses/components/video-upload-toast"
import {
  useCourseWizardStore,
  type CourseWizardStore,
} from "@/features/courses/store/use-course-wizard-store"

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateCoursePayload
    ): Promise<CourseResponse> => {
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
      return getCourse(courseId)
    },
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["course", courseId] })
      }
    },
  })
}

interface SaveCourseOptions {
  status: "draft" | "published"
  onSuccess?: (result: CourseResponse) => void
  courseId?: string
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

      if (store.thumbnail instanceof File) {
        thumbnailUrl = await uploadThumbnail(store.thumbnail)
      }

      const isNew = !store.courseId && !options.courseId
      const payload = buildCoursePayload(store, thumbnailUrl, options.status)

      if (isNew) {
        return await createCourse.mutateAsync(payload as CreateCoursePayload)
      } else {
        const courseId = store.courseId ?? options.courseId!
        return await updateCourse.mutateAsync({ courseId, payload })
      }
    },
    onSuccess: (result, { store, options }) => {
      toast.success(
        options.status === "published"
          ? "Course published successfully"
          : "Course saved as draft"
      )

      if (result?.modules?.length && store.sections.some((s) => s.lectures.some((l) => l.videoFile))) {
        const videoStore = useVideoUploadStore.getState()
        const hasClientIds = !!result.modules[0]?.clientId

        const moduleMap = new Map<string, string>()
        const topicMap = new Map<string, string>()
        for (const mod of result.modules) {
          moduleMap.set(hasClientIds ? mod.clientId : mod.id, mod.id)
          for (const topic of mod.topics) {
            topicMap.set(hasClientIds ? topic.clientId : topic.id, topic.id)
          }
        }

        const toastId = toast.custom(() => <VideoUploadToast />, {
          duration: Infinity,
          style: { opacity: 1, transform: "none" },
        })

        const uploads = uploadCourseVideos(
          store.sections,
          moduleMap,
          topicMap,
          result.id,
          store.title,
          videoStore,
        )

        Promise.allSettled(uploads).then((results) => {
          const allDone = results.every((r) => r.status === "fulfilled")
          if (allDone) {
            toast.dismiss(toastId)
            toast.success("All videos uploaded")
          } else {
            toast.dismiss(toastId)
            toast.custom(() => <VideoUploadToast />, {
              duration: Infinity,
              style: { opacity: 1, transform: "none" },
            })
          }
        })
      }

      options.onSuccess?.(result)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    },
  })
}
