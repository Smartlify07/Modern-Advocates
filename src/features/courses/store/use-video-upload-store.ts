import { create } from "zustand"
import { getCachedFile, removeCachedFile } from "@/features/videos/lib/file-cache"
import { getVideoDuration } from "@/features/videos/lib/get-video-duration"
import type { StorageUploadConfig } from "@/shared/lib/storage-upload"
import { apiFetch } from "@/shared/lib/api-fetch"

export type UploadStatus = "uploading" | "processing" | "completed" | "failed"

export interface RetryMeta {
  courseId: string
  moduleId: string
  topicId: string
  title: string
}

export interface UploadTask {
  uploadId: string
  courseId: string
  courseTitle: string
  fileName: string
  bytesUploaded: number
  totalBytes: number
  status: UploadStatus
  error?: string
  retryMeta?: RetryMeta
}

export interface VideoUploadStore {
  tasks: UploadTask[]
  addTask: (task: Omit<UploadTask, "bytesUploaded">) => void
  updateProgress: (uploadId: string, bytesUploaded: number) => void
  completeTask: (uploadId: string, status: "processing" | "completed") => void
  failTask: (uploadId: string, error: string) => void
  removeTask: (uploadId: string) => void
  clearAll: () => void
  hasActiveUploads: () => boolean
  retryUpload: (uploadId: string) => Promise<void>
}

export const useVideoUploadStore = create<VideoUploadStore>((set, get) => ({
  tasks: [],

  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks.filter((t) => t.status !== "completed"),
        { ...task, bytesUploaded: 0 },
      ],
    })),

  updateProgress: (uploadId, bytesUploaded) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.uploadId === uploadId ? { ...t, bytesUploaded } : t,
      ),
    })),

  completeTask: (uploadId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.uploadId === uploadId
          ? { ...t, status, bytesUploaded: t.totalBytes }
          : t,
      ),
    })),

  failTask: (uploadId, error) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.uploadId === uploadId ? { ...t, status: "failed", error } : t,
      ),
    })),

  removeTask: (uploadId) => {
    removeCachedFile(uploadId)
    set((state) => ({
      tasks: state.tasks.filter((t) => t.uploadId !== uploadId),
    }))
  },

  clearAll: () => {
    const { tasks } = get()
    tasks.forEach((t) => removeCachedFile(t.uploadId))
    set({ tasks: [] })
  },

  hasActiveUploads: () =>
    get().tasks.some((t) => t.status === "uploading"),

  retryUpload: async (uploadId) => {
    const task = get().tasks.find((t) => t.uploadId === uploadId)
    if (!task?.retryMeta) throw new Error("No retry metadata available")

    const file = getCachedFile(uploadId)
    if (!file) throw new Error("Original file not found. Please re-select the file.")

    const { courseId, moduleId, topicId, title } = task.retryMeta

    try {
      const config: StorageUploadConfig = await apiFetch<StorageUploadConfig>(
        "/api/videos/sign-upload",
        {
          method: "POST",
          body: { courseId, moduleId, topicId, title, mimeType: file.type },
        },
      )
      const newUploadId = config.videoId

      // Replace old task with new one using the fresh videoId
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.uploadId === uploadId
            ? { ...t, uploadId: newUploadId, status: "uploading", bytesUploaded: 0, error: undefined }
            : t,
        ),
      }))

      const xhr = new XMLHttpRequest()
      xhr.timeout = 7_200_000

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            get().updateProgress(newUploadId, Math.round((e.loaded / e.total) * file.size))
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed with status ${xhr.status}`))
        })

        xhr.addEventListener("error", () => reject(new Error("Upload failed")))
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")))
        xhr.addEventListener("timeout", () => reject(new Error("Upload timed out")))

        xhr.open("PUT", config.uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.send(file)
      })

      const duration = await getVideoDuration(file)

      await apiFetch(`/api/videos/${newUploadId}/finalize`, {
        method: "POST",
        body: { storageKey: config.storageKey, duration },
      })

      get().completeTask(newUploadId, "completed")
      removeCachedFile(uploadId)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Upload failed"
      get().failTask(uploadId, msg)
      throw error
    }
  },
}))
