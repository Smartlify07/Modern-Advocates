import { randomUUID } from "node:crypto"
import { uploadBufferToStorage } from "@/infrastructure/storage/service"

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageUploadError"
  }
}

export interface UploadImageOptions {
  file: File
  maxSize: number
  keyPrefix: string
}

export async function uploadImageAsset(
  options: UploadImageOptions,
): Promise<string> {
  if (!options.file.type.startsWith("image/")) {
    throw new ImageUploadError("File must be an image")
  }
  if (options.file.size > options.maxSize) {
    throw new ImageUploadError(
      `File must be less than ${options.maxSize / 1024 / 1024}MB`,
    )
  }

  const buffer = Buffer.from(await options.file.arrayBuffer())
  const ext = options.file.name.split(".").pop() ?? "png"
  const key = `${options.keyPrefix}${randomUUID()}.${ext}`

  return uploadBufferToStorage(buffer, key, options.file.type)
}
