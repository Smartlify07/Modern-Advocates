import { NextResponse } from "next/server"
import { z } from "zod"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { generateUploadSignature } from "@/infrastructure/cloudinary/signatures"
import {
  createVideoRecord,
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

    const video = await createVideoRecord({
      courseId,
      moduleId,
      topicId,
      title,
      description,
    })

    const uploadConfig = generateUploadSignature({
      courseId,
      moduleId,
      topicId,
      videoId: video.id,
    })

    return NextResponse.json({
      ...uploadConfig,
      videoId: video.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
