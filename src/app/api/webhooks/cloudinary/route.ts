import { NextResponse } from "next/server"
import {
  verifyWebhookSignature,
  type CloudinaryWebhookPayload,
} from "@/infrastructure/cloudinary/webhooks"
import {
  processWebhookUploadCompleted,
  processWebhookVideoReady,
  processWebhookVideoFailed,
} from "@/features/videos/services/video-service"
import * as Sentry from "@sentry/nextjs"

export async function POST(request: Request) {
  try {
    const body: CloudinaryWebhookPayload = await request.json()

    if (!verifyWebhookSignature(body)) {
      Sentry.captureMessage("Invalid Cloudinary webhook signature", {
        extra: { public_id: body.public_id, notification_type: body.notification_type },
      })
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const { notification_type, public_id, duration, error } = body

    switch (notification_type) {
      case "upload_completed":
        await processWebhookUploadCompleted(public_id, duration ?? undefined)
        break

      case "video_ready":
        await processWebhookVideoReady(public_id)
        break

      case "video_failed":
        Sentry.captureMessage("Cloudinary video processing failed", {
          extra: { public_id, error: error?.message },
        })
        await processWebhookVideoFailed(public_id)
        break

      default:
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { webhook: "cloudinary" },
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
