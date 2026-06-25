import { eq, and } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import {
  courseVideos,
  videoProgress,
} from "@/infrastructure/database/schema/video"
import { courses, enrollments } from "@/infrastructure/database/schema/course"
import {
  deleteCloudinaryAsset,
  generatePlaybackUrl,
  generateThumbnailUrl,
} from "@/infrastructure/cloudinary/service"
import type { InsertCourseVideo, SelectCourseVideo } from "@/infrastructure/database/schema/video"

export async function createVideoRecord(
  data: Pick<InsertCourseVideo, "courseId" | "moduleId" | "topicId" | "title" | "description">,
): Promise<SelectCourseVideo> {
  const [video] = await db
    .insert(courseVideos)
    .values({
      ...data,
      status: "uploading",
    })
    .returning()

  if (!video) throw new Error("Failed to create video record")
  return video
}

export async function getVideoById(videoId: string): Promise<SelectCourseVideo | null> {
  const video = await db
    .select()
    .from(courseVideos)
    .where(eq(courseVideos.id, videoId))
    .then((r) => r[0])

  return video ?? null
}

export async function getVideoByTopicId(topicId: string): Promise<SelectCourseVideo | null> {
  const video = await db
    .select()
    .from(courseVideos)
    .where(eq(courseVideos.topicId, topicId))
    .then((r) => r[0])

  return video ?? null
}

export async function resetVideoRecord(videoId: string): Promise<void> {
  const existing = await getVideoById(videoId)
  if (!existing) throw new Error("Video record not found")

  if (existing.cloudinaryPublicId) {
    try {
      await deleteCloudinaryAsset(existing.cloudinaryPublicId)
    } catch (error) {
      console.error("Cloudinary deletion failed (proceeding with reset):", error)
    }
  }

  await db
    .update(courseVideos)
    .set({
      cloudinaryPublicId: null,
      playbackUrl: null,
      thumbnailUrl: null,
      duration: null,
      status: "uploading",
    })
    .where(eq(courseVideos.id, videoId))
}

export async function verifyCourseAccess(
  courseId: string,
  userId: string,
  userRole: string,
): Promise<boolean> {
  if (userRole === "admin") return true

  const course = await db
    .select({ tutorId: courses.tutorId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .then((r) => r[0])

  if (!course) return false
  if (course.tutorId === userId) return true

  const enrollment = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.studentId, userId),
        eq(enrollments.status, "active"),
      ),
    )
    .then((r) => r[0])

  return !!enrollment
}

export async function verifyInstructorOwnership(
  courseId: string,
  userId: string,
): Promise<boolean> {
  const course = await db
    .select({ tutorId: courses.tutorId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .then((r) => r[0])

  return course?.tutorId === userId
}

export async function deleteVideo(videoId: string): Promise<void> {
  const video = await getVideoById(videoId)
  if (!video) throw new Error("Video not found")

  if (video.cloudinaryPublicId) {
    try {
      await deleteCloudinaryAsset(video.cloudinaryPublicId)
    } catch (error) {
      console.error("Cloudinary deletion failed (proceeding with DB cleanup):", error)
    }
  }

  await db.delete(courseVideos).where(eq(courseVideos.id, videoId))
}

export async function processWebhookUploadCompleted(
  publicId: string,
  duration: number | undefined,
): Promise<void> {
  const videoId = publicId.split("/").pop()
  if (!videoId) return

  await db
    .update(courseVideos)
    .set({
      cloudinaryPublicId: publicId,
      duration: duration ? Math.round(duration) : null,
      status: "processing",
    })
    .where(eq(courseVideos.id, videoId))

  await db
    .update(courseVideos)
    .set({
      playbackUrl: generatePlaybackUrl(publicId),
      thumbnailUrl: generateThumbnailUrl(publicId),
      status: "ready",
    })
    .where(eq(courseVideos.id, videoId))
}

export async function processWebhookVideoReady(publicId: string): Promise<void> {
  const videoId = publicId.split("/").pop()
  if (!videoId) return

  const playbackUrl = generatePlaybackUrl(publicId)
  const thumbnailUrl = generateThumbnailUrl(publicId)

  await db
    .update(courseVideos)
    .set({
      playbackUrl,
      thumbnailUrl,
      status: "ready",
    })
    .where(eq(courseVideos.id, videoId))
}

export async function processWebhookVideoFailed(publicId: string): Promise<void> {
  const videoId = publicId.split("/").pop()
  if (!videoId) return

  await db
    .update(courseVideos)
    .set({ status: "failed" })
    .where(eq(courseVideos.id, videoId))
}

export async function upsertProgress(
  userId: string,
  videoId: string,
  watchedSeconds: number,
  duration: number,
): Promise<void> {
  const existing = await db
    .select()
    .from(videoProgress)
    .where(
      and(
        eq(videoProgress.userId, userId),
        eq(videoProgress.videoId, videoId),
      ),
    )
    .then((r) => r[0])

  if (existing) {
    const diff = Math.abs(watchedSeconds - existing.watchedSeconds)
    if (diff < 5) return

    const completed = duration > 0 && watchedSeconds / duration >= 0.9

    await db
      .update(videoProgress)
      .set({
        watchedSeconds,
        completed: completed || existing.completed,
        lastWatchedAt: new Date(),
      })
      .where(eq(videoProgress.id, existing.id))
  } else {
    const completed = duration > 0 && watchedSeconds / duration >= 0.9

    await db.insert(videoProgress).values({
      userId,
      videoId,
      watchedSeconds,
      completed,
    })
  }
}

export async function getProgress(
  userId: string,
  videoId: string,
): Promise<{ watchedSeconds: number; completed: boolean } | null> {
  const progress = await db
    .select({
      watchedSeconds: videoProgress.watchedSeconds,
      completed: videoProgress.completed,
    })
    .from(videoProgress)
    .where(
      and(
        eq(videoProgress.userId, userId),
        eq(videoProgress.videoId, videoId),
      ),
    )
    .then((r) => r[0])

  return progress ?? null
}
