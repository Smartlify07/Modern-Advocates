import { NextResponse } from "next/server"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { cloudinary } from "@/infrastructure/cloudinary/config"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    await requireInstructorOrAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "course-thumbnails",
          resource_type: "image",
          transformation: [{ width: 1280, height: 720, crop: "fill", quality: "auto" }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string })
        },
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
