import { NextResponse } from "next/server"
import {
  requireInstructorOrAdmin,
  requireSession,
} from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import {
  getVideoById,
  verifyCourseAccess,
  deleteVideo,
  getProgress,
} from "@/features/videos/services/video-service"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
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

    const progress = await getProgress(user.id, videoId)

    return NextResponse.json({
      id: video.id,
      courseId: video.courseId,
      moduleId: video.moduleId,
      title: video.title,
      description: video.description,
      playbackUrl: video.playbackUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      status: video.status,
      progress: progress ?? { watchedSeconds: 0, completed: false },
    })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },

    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ videoId: string }> },
) {
  try {
    const { user } = await requireInstructorOrAdmin()
    const { videoId } = await params

    const video = await getVideoById(videoId)
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    if ((user.role ?? "user") !== "admin" && video.courseId) {
      const { verifyInstructorOwnership } = await import(
        "@/features/videos/services/video-service"
      )
      const owns = await verifyInstructorOwnership(video.courseId!, user.id)
      if (!owns) {
        return NextResponse.json(
          { error: "You do not own this course" },
          { status: 403 },
        )
      }
    }

    await deleteVideo(videoId)

    return NextResponse.json({ success: true })
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
