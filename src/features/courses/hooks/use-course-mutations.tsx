"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  buildCoursePayload,
  uploadThumbnail,
  createCourse,
  updateCourse,
  uploadCourseVideos,
  type CreateCoursePayload,
  type CourseResponse,
} from "@/features/courses/api/course-service"
import { useVideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { VideoUploadToast } from "@/features/courses/components/video-upload-toast"
import type { CourseWizardStore } from "@/features/courses/store/use-course-wizard-store"

interface SaveCourseOptions {
  status: "draft" | "published"
  onSuccess?: (result: CourseResponse) => void
  courseId?: string
}

export function useSaveCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      store,
      options,
    }: {
      store: CourseWizardStore
      options: SaveCourseOptions
    }): Promise<CourseResponse | void> => {
      let thumbnailUrl: string | undefined

      if (store.thumbnail instanceof File) {
        thumbnailUrl = await uploadThumbnail(store.thumbnail)
      }

      const isNew = !store.courseId && !options.courseId
      const payload = buildCoursePayload(store, thumbnailUrl, options.status)

      if (isNew) {
        return await createCourse(payload as CreateCoursePayload)
      } else {
        const courseId = store.courseId ?? options.courseId!
        await updateCourse(courseId, payload)
      }
    },
    onSuccess: (result, { store, options }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })

      toast.success(
        options.status === "published"
          ? "Course published successfully"
          : "Course saved as draft",
      )

      if (
        result &&
        store.sections.some((s) => s.lectures.some((l) => l.videoFile))
      ) {
        const videoStore = useVideoUploadStore.getState()

        const moduleMap = new Map<string, string>()
        const topicMap = new Map<string, string>()
        for (const mod of (result as CourseResponse).modules) {
          moduleMap.set(mod.clientId, mod.id)
          for (const topic of mod.topics) {
            topicMap.set(topic.clientId, topic.id)
          }
        }

        const toastId = toast.custom(() => <VideoUploadToast />, {
          duration: Infinity,
          style: { opacity: 1, transform: "none" },
        })

        const courseTitle = store.title
        const uploads = uploadCourseVideos(
          store.sections,
          moduleMap,
          topicMap,
          (result as CourseResponse).id,
          courseTitle,
          videoStore,
        )

        Promise.allSettled(uploads).then((results) => {
          const allDone = results.every(
            (r) => r.status === "fulfilled",
          )
          if (allDone) {
            toast.dismiss(toastId)
            toast.success("All videos uploaded")
          } else {
            toast.dismiss(toastId)
            toast.custom(() => <VideoUploadToast />, { duration: Infinity, style: { opacity: 1, transform: "none" } })
          }
        })
      }

      options.onSuccess?.(result as CourseResponse)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    },
  })
}
