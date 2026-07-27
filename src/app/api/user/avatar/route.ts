import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"
import { uploadImageAsset, ImageUploadError } from "@/shared/lib/upload-image"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new UnauthorizedError()
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const url = await uploadImageAsset({
      file,
      maxSize: 2 * 1024 * 1024,
      keyPrefix: `avatars/${session.user.id}/`,
    })

    return NextResponse.json({ url })
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
