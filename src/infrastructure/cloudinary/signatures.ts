import { cloudinary } from "./config"

export interface UploadSignatureParams {
  courseId: string
  moduleId: string
  topicId: string
  videoId: string
}

export interface UploadSignatureResult {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}



export function generateUploadSignature({
  courseId,
  moduleId,
  topicId,
  videoId,
}: UploadSignatureParams): UploadSignatureResult {
  const timestamp = Math.round(Date.now() / 1000)
  const folder = `course-videos/${courseId}/${moduleId}/${topicId}`

  const params: Record<string, string | number> = {
    timestamp,
    folder,
    public_id: videoId,
    eager: "sp_hd",
    eager_async: "1",
    // notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cloudinary`,
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  )

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}
