import { apiFetch } from "@/shared/lib/api-fetch"
import { uploadToStorage, type StorageUploadConfig } from "@/shared/lib/storage-upload"
import { getVideoDuration } from "@/features/videos/lib/get-video-duration"

export interface VideoUploadMeta {
  courseId: string
  moduleId: string
  topicId: string
  title: string
}

const SIGN_BODY = (meta: VideoUploadMeta, mimeType: string) => ({
  courseId: meta.courseId,
  moduleId: meta.moduleId,
  topicId: meta.topicId,
  title: meta.title,
  mimeType,
})

export async function signVideoUpload(
  meta: VideoUploadMeta,
  mimeType: string,
): Promise<StorageUploadConfig> {
  return apiFetch<StorageUploadConfig>("/api/videos/sign-upload", {
    method: "POST",
    body: SIGN_BODY(meta, mimeType),
  })
}

export async function uploadVideoWithProgress(
  file: File,
  config: StorageUploadConfig,
  onProgress?: (bytesUploaded: number) => void,
): Promise<void> {
  await uploadToStorage(file, config, (progress) => {
    onProgress?.(progress.bytesUploaded)
  })

  const duration = await getVideoDuration(file)

  await apiFetch(`/api/videos/${config.videoId}/finalize`, {
    method: "POST",
    body: { storageKey: config.storageKey, duration },
  })
}