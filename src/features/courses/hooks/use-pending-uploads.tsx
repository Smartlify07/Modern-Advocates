"use client"

import { useCallback, useEffect, useState } from "react"
import { useVideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { uploadInChunks, type ChunkedUploadConfig } from "@/shared/lib/cloudinary-upload"
import { VideoUploadToast } from "@/features/courses/components/video-upload-toast"
import { toast } from "sonner"

const STORAGE_KEY = "ma_pending_uploads"

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
    return raw ? JSON.parse(raw) : []
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

export function updatePendingUpload(uploadId: string, bytesUploaded: number): void {
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
): Promise<ChunkedUploadConfig & { videoId: string }> {
  const res = await fetch("/api/videos/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, moduleId, topicId, title }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "Failed to get upload signature")
  }
  return res.json()
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

  const resumeUpload = useCallback(
    async (uploadId: string, file: File) => {
      const all = readStorage()
      const pendingUpload = all.find((u) => u.uploadId === uploadId)
      if (!pendingUpload) {
        toast.error("Pending upload not found")
        return
      }

      if (file.size !== pendingUpload.fileSize || file.lastModified !== pendingUpload.lastModified) {
        toast.error("Selected file does not match the original. Please select the exact same file.")
        return
      }

      const addTask = useVideoUploadStore.getState().addTask
      const updateProgress = useVideoUploadStore.getState().updateProgress
      const completeTask = useVideoUploadStore.getState().completeTask
      const failTask = useVideoUploadStore.getState().failTask

      let config: ChunkedUploadConfig & { videoId: string }
      try {
        config = await getFreshSignedConfig(
          pendingUpload.courseId,
          pendingUpload.moduleId,
          pendingUpload.topicId,
          pendingUpload.fileName,
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
        duration: Infinity,
        style: { opacity: 1, transform: "none" },
      })

      try {
        await uploadInChunks(file, config, (progress) => {
          updateProgress(config.videoId, progress.bytesUploaded)
          updatePendingUpload(uploadId, progress.bytesUploaded)
        }, { resumeFromBytes: pendingUpload.bytesUploaded })

        completeTask(config.videoId, "processing")
        removePendingUpload(uploadId)
        setPending((prev) => prev.filter((p) => p.uploadId !== uploadId))
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed"
        failTask(config.videoId, msg)
      }
    },
    [],
  )

  const dismiss = useCallback((uploadId: string) => {
    removePendingUpload(uploadId)
    setPending((prev) => prev.filter((p) => p.uploadId !== uploadId))
  }, [])

  return { pending, resumeUpload, dismiss }
}
