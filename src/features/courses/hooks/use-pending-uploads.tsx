"use client"

import { useCallback, useEffect, useState } from "react"
import { useVideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { uploadToStorage, type StorageUploadConfig } from "@/shared/lib/storage-upload"
import { apiFetch } from "@/shared/lib/api-fetch"
import { VideoUploadToast } from "@/features/courses/components/video-upload-toast"
import { getVideoDuration } from "@/features/videos/lib/get-video-duration"
import { toast } from "sonner"

const STORAGE_KEY = "ma_pending_uploads"
const MAX_AGE_MS = 24 * 60 * 60 * 1000

export interface PendingUpload {
  uploadId: string
  courseId: string
  moduleId: string
  topicId: string
  fileName: string
  fileSize: number
  lastModified: number
  bytesUploaded: number
  totalBytes: number
  timestamp: number
}

function readStorage(): PendingUpload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all: PendingUpload[] = raw ? JSON.parse(raw) : []
    const now = Date.now()
    const fresh = all.filter((u) => now - u.timestamp < MAX_AGE_MS)
    if (fresh.length !== all.length) writeStorage(fresh)
    return fresh
  } catch {
    return []
  }
}

function writeStorage(uploads: PendingUpload[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads))
}

export function savePendingUpload(upload: PendingUpload): void {
  const all = readStorage()
  const idx = all.findIndex((u) => u.uploadId === upload.uploadId)
  if (idx >= 0) {
    all[idx] = upload
  } else {
    all.push(upload)
  }
  writeStorage(all)
}

export function updatePendingUpload(
  uploadId: string,
  bytesUploaded: number,
): void {
  const all = readStorage()
  const found = all.find((u) => u.uploadId === uploadId)
  if (found) {
    found.bytesUploaded = bytesUploaded
    writeStorage(all)
  }
}

export function removePendingUpload(uploadId: string): void {
  const all = readStorage().filter((u) => u.uploadId !== uploadId)
  writeStorage(all)
}

export function getPendingUploadsForCourse(courseId: string): PendingUpload[] {
  return readStorage().filter((u) => u.courseId === courseId)
}

export function getAllPendingUploads(): PendingUpload[] {
  return readStorage()
}

export function clearPendingUploads(): void {
  localStorage.removeItem(STORAGE_KEY)
}

async function getFreshSignedConfig(
  courseId: string,
  moduleId: string,
  topicId: string,
  title: string,
  mimeType: string,
): Promise<StorageUploadConfig> {
  return apiFetch<StorageUploadConfig>("/api/videos/sign-upload", {
    method: "POST",
    body: { courseId, moduleId, topicId, title, mimeType },
  })
}

export function usePendingUploads(courseId?: string) {
  const [pending, setPending] = useState<PendingUpload[]>([])

  useEffect(() => {
    if (courseId) {
      setPending(getPendingUploadsForCourse(courseId))
    } else {
      setPending(getAllPendingUploads())
    }
  }, [courseId])

  const resumeUpload = useCallback(async (uploadId: string, file: File) => {
    const all = readStorage()
    const pendingUpload = all.find((u) => u.uploadId === uploadId)
    if (!pendingUpload) {
      toast.error("Pending upload not found")
      return
    }

    if (
      file.size !== pendingUpload.fileSize ||
      file.lastModified !== pendingUpload.lastModified
    ) {
      toast.error(
        "Selected file does not match the original. Please select the exact same file."
      )
      return
    }

    const addTask = useVideoUploadStore.getState().addTask
    const updateProgress = useVideoUploadStore.getState().updateProgress
    const completeTask = useVideoUploadStore.getState().completeTask
    const failTask = useVideoUploadStore.getState().failTask
    const removeTask = useVideoUploadStore.getState().removeTask

    // Remove any previous failed task for this upload so it doesn't linger in the toast
    removeTask(pendingUpload.uploadId)
    removePendingUpload(uploadId)

    let config: StorageUploadConfig
    try {
        config = await getFreshSignedConfig(
          pendingUpload.courseId,
          pendingUpload.moduleId,
          pendingUpload.topicId,
          pendingUpload.fileName,
          file.type,
        )
    } catch (err) {
      toast.error("Failed to get upload signature")
      return
    }

    addTask({
      uploadId: config.videoId,
      courseId: pendingUpload.courseId,
      courseTitle: "",
      fileName: pendingUpload.fileName,
      totalBytes: file.size,
      status: "uploading",
    })

    toast.custom(() => <VideoUploadToast />, {
      id: "video-upload-progress",
      duration: Infinity,
    })

    try {
      await uploadToStorage(file, config, (progress) => {
        updateProgress(config.videoId, progress.bytesUploaded)
        updatePendingUpload(uploadId, progress.bytesUploaded)
      })

      const duration = await getVideoDuration(file)

      await apiFetch(`/api/videos/${config.videoId}/finalize`, {
        method: "POST",
        body: { storageKey: config.storageKey, duration },
      })

      completeTask(config.videoId, "completed")
      removePendingUpload(uploadId)
      setPending((prev) => prev.filter((p) => p.uploadId !== uploadId))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      failTask(config.videoId, msg)
    }
  }, [])

  const dismiss = useCallback((uploadId: string) => {
    removePendingUpload(uploadId)
    setPending((prev) => prev.filter((p) => p.uploadId !== uploadId))
  }, [])

  return { pending, resumeUpload, dismiss }
}
