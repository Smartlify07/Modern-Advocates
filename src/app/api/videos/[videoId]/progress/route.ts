import { NextResponse } from "next/server"
import { z } from "zod"
import { requireSession } from "@/infrastructure/auth/helpers"
import {
  getVideoById,
  verifyCourseAccess,
  upsertProgress,
} from "@/features/videos/services/video-service"
import * as Sentry from "@sentry/nextjs"

const schema = z.object({
  watchedSeconds: z.number().int().min(0),
  duration: z.number().int().min(0),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> },
) {
  try {
    const { user } = await requireSession()
    const { videoId } = await params

    const video = await getVideoById(videoId)
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const canAccess = await verifyCourseAccess(
      video.courseId!,
      user.id,
      user.role ?? "user",
    )
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { watchedSeconds, duration } = parsed.data

    await upsertProgress(user.id, videoId, watchedSeconds, duration)

    const completed = duration > 0 && watchedSeconds / duration >= 0.9

    return NextResponse.json({ success: true, completed })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
