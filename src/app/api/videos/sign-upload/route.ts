import { NextResponse } from "next/server"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import { courseVideos } from "@/infrastructure/database/schema/video"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import {
  generatePresignedUploadUrl,
  getPublicUrl,
} from "@/infrastructure/storage/service"
import {
  createVideoRecord,
  getVideoByTopicId,
  resetVideoRecord,
  verifyInstructorOwnership,
} from "@/features/videos/services/video-service"
import * as Sentry from "@sentry/nextjs"

const schema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
})

export async function POST(request: Request) {
  try {
    const { user } = await requireInstructorOrAdmin()

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { courseId, moduleId, topicId, title, description } = parsed.data

    if (user.role !== "admin") {
      const owns = await verifyInstructorOwnership(courseId, user.id)
      if (!owns) {
        return NextResponse.json(
          { error: "You do not own this course" },
          { status: 403 },
        )
      }
    }

    const existing = await getVideoByTopicId(topicId)

    let videoId: string
    if (existing) {
      await resetVideoRecord(existing.id)
      await db
        .update(courseVideos)
        .set({ title, description })
        .where(eq(courseVideos.id, existing.id))
      videoId = existing.id
    } else {
      const video = await createVideoRecord({
        courseId,
        moduleId,
        topicId,
        title,
        description,
      })
      videoId = video.id
    }

    const storageKey = `course-videos/${courseId}/${moduleId}/${topicId}/${videoId}.mp4`
    const uploadUrl = await generatePresignedUploadUrl(storageKey, "video/mp4")
    const publicUrl = getPublicUrl(storageKey)

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      videoId,
      storageKey,
    })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    Sentry.captureException(error)
  console.error(error, "Error at signing")
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
