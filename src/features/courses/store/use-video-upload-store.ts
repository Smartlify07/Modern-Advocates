import { create } from "zustand"

export type UploadStatus = "uploading" | "processing" | "completed" | "failed"

export interface UploadTask {
  uploadId: string
  courseId: string
  courseTitle: string
  fileName: string
  bytesUploaded: number
  totalBytes: number
  status: UploadStatus
  error?: string
}

export interface VideoUploadStore {
  tasks: UploadTask[]
  addTask: (task: Omit<UploadTask, "bytesUploaded">) => void
  updateProgress: (uploadId: string, bytesUploaded: number) => void
  completeTask: (uploadId: string, status: "processing" | "completed") => void
  failTask: (uploadId: string, error: string) => void
  removeTask: (uploadId: string) => void
  clearCompleted: () => void
  hasActiveUploads: () => boolean
}

export const useVideoUploadStore = create<VideoUploadStore>((set, get) => ({
  tasks: [],

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, bytesUploaded: 0 }],
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

  removeTask: (uploadId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.uploadId !== uploadId),
    })),

  clearCompleted: () =>
    set((state) => ({
      tasks: state.tasks.filter(
        (t) => t.status !== "completed" && t.status !== "failed",
      ),
    })),

  hasActiveUploads: () =>
    get().tasks.some((t) => t.status === "uploading"),
}))
