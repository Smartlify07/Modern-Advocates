import { NextResponse } from "next/server"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"
import { uploadImageAsset, ImageUploadError } from "@/shared/lib/upload-image"

export async function POST(request: Request) {
  try {
    await requireInstructorOrAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const { url, key } = await uploadImageAsset({
      file,
      maxSize: 5 * 1024 * 1024,
      keyPrefix: "course-thumbnails/",
    })

    return NextResponse.json({ url, key })
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error(error)
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
