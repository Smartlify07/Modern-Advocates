import crypto from "node:crypto"

export interface CloudinaryWebhookPayload {
  notification_type: string
  public_id: string
  version: number
  signature: string
  secure_url?: string
  duration?: number
  width?: number
  height?: number
  format?: string
  resource_type?: string
  created_at?: string
  tags?: string[]
  error?: {
    message: string
  }
}

export function verifyWebhookSignature(payload: CloudinaryWebhookPayload): boolean {
  const { public_id, version, signature } = payload
  if (!public_id || !version || !signature) return false

  const expected = crypto
    .createHash("sha256")
    .update(`${public_id}${version}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex")

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}
