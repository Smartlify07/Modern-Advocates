import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/auth"
import { uploadBufferToStorage } from "@/infrastructure/storage/service"
import { UnauthorizedError } from "@/infrastructure/auth/errors"
import * as Sentry from "@sentry/nextjs"
import { randomUUID } from "node:crypto"

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
    const key = `avatars/${session.user.id}/${randomUUID()}-${file.name}`

    const url = await uploadBufferToStorage(buffer, key, file.type, 604800)

    return NextResponse.json({ url })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
