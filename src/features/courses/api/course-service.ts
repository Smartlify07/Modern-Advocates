import type { CourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import type { VideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { uploadInChunks, type ChunkedUploadConfig } from "@/shared/lib/cloudinary-upload"
import {
  savePendingUpload,
  updatePendingUpload,
  removePendingUpload,
} from "@/features/courses/hooks/use-pending-uploads"

const LANGUAGE_MAP: Record<string, string> = {
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Chinese: "zh",
  Japanese: "ja",
  Arabic: "ar",
  Portuguese: "pt",
}

export interface ModulePayload {
  id?: string
  title: string
  order: number
  topics: TopicPayload[]
}

export interface TopicPayload {
  id?: string
  title: string
  type: "text" | "video" | "video_and_text"
  description: string | null
  order: number
}

export interface CreateCoursePayload {
  title: string
  thumbnailUrl?: string | null
  overview?: string | null
  language: string
  level: string
  price: number
  discountedPrice?: number | null
  isFree: boolean
  status: "draft" | "published"
  modules: ModulePayload[]
}

export interface CourseResponse {
  id: string
  modules: Array<{
    id: string
    clientId: string
    title: string
    sortOrder: number
    topics: Array<{
      id: string
      clientId: string
      title: string
      sortOrder: number
    }>
  }>
}

export interface UpdateCoursePayload {
  title?: string
  thumbnailUrl?: string | null
  overview?: string | null
  language?: string
  level?: string
  price?: number
  discountedPrice?: number | null
  isFree?: boolean
  status?: "draft" | "published" | "archived"
  modules?: ModulePayload[]
}

function normalizeLanguage(name: string): string {
  return LANGUAGE_MAP[name] ?? name.toLowerCase().slice(0, 2)
}

export function buildCoursePayload(
  store: CourseWizardStore,
  thumbnailUrl?: string,
  status?: "draft" | "published",
): CreateCoursePayload {
  return {
    title: store.title,
    thumbnailUrl: thumbnailUrl ?? store.thumbnailPreview ?? null,
    overview: store.overview ? JSON.stringify(store.overview) : null,
    language: normalizeLanguage(store.language),
    level: store.level,
    price: store.originalPrice ? Number(store.originalPrice) : 0,
    discountedPrice: store.showStrikedOriginal && store.salePrice
      ? Number(store.salePrice)
      : null,
    isFree: !store.originalPrice,
    status: status ?? "draft",
    modules: store.sections.map((s, si) => ({
      id: s.id,
      title: s.title,
      order: si,
      topics: s.lectures.map((l, li) => ({
        id: l.id,
        title: l.title,
        type: l.mediaType === "video" ? "video_and_text" : "text",
        description: l.notesContent || null,
        order: li,
      })),
    })),
  }
}

export async function uploadThumbnail(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to upload thumbnail")
  }

  const data = await res.json()
  return data.url as string
}

export async function getCourse(courseId: string): Promise<CourseResponse> {
  const res = await fetch(`/api/courses/${courseId}`)
  if (!res.ok) throw new Error("Failed to fetch course")
  return res.json()
}

async function getSignedUploadConfig(
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

export async function uploadSingleVideoWithTracking(
  videoFile: File,
  moduleId: string,
  topicId: string,
  courseId: string,
  title: string,
  courseTitle: string,
  store: VideoUploadStore,
): Promise<void> {
  const config = await getSignedUploadConfig(courseId, moduleId, topicId, title)
  const uploadId = config.videoId

  store.addTask({
    uploadId,
    courseId,
    courseTitle,
    fileName: videoFile.name,
    totalBytes: videoFile.size,
    status: "uploading",
  })

  savePendingUpload({
    uploadId,
    courseId,
    moduleId,
    topicId,
    fileName: videoFile.name,
    fileSize: videoFile.size,
    lastModified: videoFile.lastModified,
    bytesUploaded: 0,
    totalBytes: videoFile.size,
    timestamp: Date.now(),
  })

  try {
    await uploadInChunks(videoFile, config, (progress) => {
      store.updateProgress(uploadId, progress.bytesUploaded)
      updatePendingUpload(uploadId, progress.bytesUploaded)
    })

    store.completeTask(uploadId, "processing")
    removePendingUpload(uploadId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed"
    store.failTask(uploadId, msg)
    throw err
  }
}

export function uploadCourseVideos(
  sections: CourseWizardStore["sections"],
  moduleIdMap: Map<string, string>,
  topicIdMap: Map<string, string>,
  courseId: string,
  courseTitle: string,
  store: VideoUploadStore,
): Promise<void>[] {
  const uploads: Promise<void>[] = []
  for (const section of sections) {
    const moduleId = moduleIdMap.get(section.id)
    if (!moduleId) continue
    for (const lecture of section.lectures) {
      if (!lecture.videoFile) continue
      const topicId = topicIdMap.get(lecture.id)
      if (!topicId) continue
      uploads.push(
        uploadSingleVideoWithTracking(
          lecture.videoFile,
          moduleId,
          topicId,
          courseId,
          lecture.title,
          courseTitle,
          store,
        ).catch((err) => {
          console.error(`Failed to upload video for lecture "${lecture.title}":`, err)
        }),
      )
    }
  }
  return uploads
}
