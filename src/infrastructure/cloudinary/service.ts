import { cloudinary } from "./config"

export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    })
    if (result.result !== "ok") {
      throw new Error(`Cloudinary deletion returned: ${result.result}`)
    }
  } catch (error) {
    throw new Error(
      `Failed to delete Cloudinary asset: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export function generatePlaybackUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [
      { quality: "auto" },
      { streaming_profile: "sp_hd" },
    ],
    format: "m3u8",
  })
}

export function generateThumbnailUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [
      { width: 640, height: 360, crop: "fill", quality: "auto" },
    ],
    format: "jpg",
  })
}
