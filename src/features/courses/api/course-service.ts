import type { CourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import type { VideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { uploadToStorage, type StorageUploadConfig } from "@/shared/lib/storage-upload"
import {
  savePendingUpload,
  updatePendingUpload,
  removePendingUpload,
} from "@/features/courses/hooks/use-pending-uploads"
import { cacheFile, removeCachedFile } from "@/features/videos/lib/file-cache"
import { getVideoDuration } from "@/features/videos/lib/get-video-duration"

export const DURATION_UNITS = ["Minutes", "Hours", "Days", "Weeks"] as const
export type DurationUnit = (typeof DURATION_UNITS)[number]

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
  videoTitle?: string | null
}

export interface CreateCoursePayload {
  title: string
  thumbnailUrl?: string | null
  overview?: string | null
  language: string
  level: string
  duration?: number | null
  durationUnit?: DurationUnit
  instructorName?: string | null
  instructorSpecialty?: string | null
  aboutInstructor?: string | null
  instructorImage?: string | null
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
  duration?: number | null
  durationUnit?: DurationUnit
  instructorName?: string | null
  instructorSpecialty?: string | null
  aboutInstructor?: string | null
  instructorImage?: string | null
  price?: number
  discountedPrice?: number | null
  isFree?: boolean
  status?: "draft" | "published" | "archived"
  modules?: ModulePayload[]
}

function normalizeLanguage(name: string): string {
  return LANGUAGE_MAP[name] ?? name.toLowerCase().slice(0, 2)
}

const UNIT_TO_MINUTES: Record<DurationUnit, number> = {
  Minutes: 1,
  Hours: 60,
  Days: 1440,
  Weeks: 10080,
}

export function durationToMinutes(value: number, unit: DurationUnit): number {
  return value * UNIT_TO_MINUTES[unit]
}

export function minutesToDuration(
  minutes: number,
  unit: DurationUnit
): { value: number; unit: DurationUnit } {
  const divisor = UNIT_TO_MINUTES[unit]
  return { value: minutes / divisor, unit }
}

export function buildCoursePayload(
  store: CourseWizardStore,
  thumbnailUrl?: string,
  status?: "draft" | "published" | "archived",
  instructorImageUrl?: string | null
): CreateCoursePayload {
  return {
    title: store.title,
    thumbnailUrl: thumbnailUrl ?? store.thumbnailPreview ?? null,
    overview: store.overview ? JSON.stringify(store.overview) : null,
    language: normalizeLanguage(store.language),
    level: store.level,
    duration: store.duration
      ? durationToMinutes(
          Number(store.duration),
          (store.durationUnit || "Hours") as DurationUnit
        )
      : null,
    durationUnit: (store.durationUnit as DurationUnit) || "Hours",
    instructorName: store.instructorName || null,
    instructorSpecialty: store.instructorSpecialty || null,
    aboutInstructor: store.aboutInstructor || null,
    instructorImage: instructorImageUrl ?? store.instructorPhotoPreview ?? null,
    price: store.originalPrice ? Number(store.originalPrice) : 0,
    discountedPrice:
      store.showStrikedOriginal && store.salePrice
        ? Number(store.salePrice)
        : null,
    isFree: !store.originalPrice,
    status: status ?? "draft",
    modules: store.modules.map((m, mi) => ({
      id: m.id,
      title: m.title,
      order: mi,
      topics: m.topics.map((t, ti) => ({
        id: t.id,
        title: t.title,
        type: t.type,
        description: t.description ?? null,
        order: ti,
        videoTitle: t.videoTitle ?? null,
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
  mimeType: string,
): Promise<StorageUploadConfig> {
  const res = await fetch("/api/videos/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, moduleId, topicId, title, mimeType }),
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
  store: VideoUploadStore
): Promise<void> {
  const config = await getSignedUploadConfig(courseId, moduleId, topicId, title, videoFile.type)
  const uploadId = config.videoId

  cacheFile(uploadId, videoFile)

  store.addTask({
    uploadId,
    courseId,
    courseTitle,
    fileName: videoFile.name,
    totalBytes: videoFile.size,
    status: "uploading",
    retryMeta: { courseId, moduleId, topicId, title },
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
    await uploadToStorage(videoFile, config, (progress) => {
      store.updateProgress(uploadId, progress.bytesUploaded)
      updatePendingUpload(uploadId, progress.bytesUploaded)
    })

    const duration = await getVideoDuration(videoFile)

    const finalizeRes = await fetch(`/api/videos/${config.videoId}/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storageKey: config.storageKey, duration }),
    })

    if (!finalizeRes.ok) {
      const errBody = await finalizeRes.json().catch(() => null)
      throw new Error(errBody?.error ?? "Failed to finalize upload")
    }

    store.completeTask(uploadId, "completed")
    removePendingUpload(uploadId)
    removeCachedFile(uploadId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed"
    store.failTask(uploadId, msg)
    console.error(err)
    throw err
  }
}

export function uploadCourseVideos(
  modules: CourseWizardStore["modules"],
  moduleIdMap: Map<string, string>,
  topicIdMap: Map<string, string>,
  courseId: string,
  courseTitle: string,
  store: VideoUploadStore
): Promise<void>[] {
  const uploads: Promise<void>[] = []
  for (const mod of modules) {
    const moduleId = moduleIdMap.get(mod.id)
    if (!moduleId) continue
    for (const topic of mod.topics) {
      if (!topic.videoFile) continue
      const topicId = topicIdMap.get(topic.id)
      if (!topicId) continue
      uploads.push(
        uploadSingleVideoWithTracking(
          topic.videoFile,
          moduleId,
          topicId,
          courseId,
          topic.videoTitle ?? topic.title,
          courseTitle,
          store
        ).catch((err) => {
          console.error(
            `Failed to upload video for topic "${topic.title}":`,
            err
          )
        })
      )
    }
  }
  return uploads
}
