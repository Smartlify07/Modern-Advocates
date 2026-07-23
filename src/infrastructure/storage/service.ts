import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3, B2_BUCKET } from "./config"

export async function deleteStorageAsset(key: string): Promise<void> {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: B2_BUCKET, Key: key }))
  } catch (error) {
    throw new Error(
      `Failed to delete storage asset: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn = 604800, // max 7 days for S3 presigned URLs
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
  })

  return getSignedUrl(s3, command, { expiresIn })
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
  expiresIn = 604800, // max 7 days for S3 presigned URLs
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  )

  return generatePresignedDownloadUrl(key, expiresIn)
}
