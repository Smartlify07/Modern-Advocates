import { NextResponse } from "next/server"
import { z } from "zod"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { generatePresignedDownloadUrl } from "@/infrastructure/storage/service"
import {
  getVideoById,
  verifyInstructorOwnership,
  markVideoReady,
} from "@/features/videos/services/video-service"
import * as Sentry from "@sentry/nextjs"

const schema = z.object({
  storageKey: z.string().min(1),
  duration: z.number().int().positive().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> },
) {
  try {
    const { user } = await requireInstructorOrAdmin()
    const { videoId } = await params

    const video = await getVideoById(videoId)
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    if (user.role !== "admin") {
      const owns = await verifyInstructorOwnership(video.courseId!, user.id)
      if (!owns) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { storageKey, duration } = parsed.data

    const playbackUrl = await generatePresignedDownloadUrl(storageKey)

    await markVideoReady(videoId, storageKey, playbackUrl, duration)

    const updated = await getVideoById(videoId)

    return NextResponse.json({
      id: videoId,
      playbackUrl: updated?.playbackUrl ?? playbackUrl,
      storageKey: updated?.storageKey ?? storageKey,
      duration: updated?.duration ?? duration ?? null,
      status: updated?.status ?? "ready",
    })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
