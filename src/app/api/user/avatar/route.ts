import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
import { cloudinary } from "@/infrastructure/cloudinary/config"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"

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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be less than 2MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          resource_type: "image",
          transformation: [
            { width: 300, height: 300, crop: "fill", quality: "auto" },
          ],
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
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}