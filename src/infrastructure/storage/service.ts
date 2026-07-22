import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3, B2_BUCKET, B2_PUBLIC_DOMAIN } from "./config"

export async function deleteStorageAsset(key: string): Promise<void> {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: B2_BUCKET, Key: key }))
  } catch (error) {
    throw new Error(
      `Failed to delete storage asset: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export function getPublicUrl(key: string): string {
  return `${B2_PUBLIC_DOMAIN}/file/${B2_BUCKET}/${key}`
}

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 })
}

export async function uploadBufferToStorage(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  )

  return getPublicUrl(key)
}
