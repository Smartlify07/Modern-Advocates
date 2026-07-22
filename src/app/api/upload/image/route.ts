import { NextResponse } from "next/server"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { uploadBufferToStorage } from "@/infrastructure/storage/service"
import * as Sentry from "@sentry/nextjs"
import { randomUUID } from "node:crypto"

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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be less than 5MB" },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split(".").pop() ?? "png"
    const key = `course-thumbnails/${randomUUID()}.${ext}`
    const url = await uploadBufferToStorage(buffer, key, file.type)

    return NextResponse.json({ url })
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
