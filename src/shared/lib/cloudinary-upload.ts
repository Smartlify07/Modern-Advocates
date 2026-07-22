const CHUNK_SIZE = 5 * 1024 * 1024

export interface ChunkedUploadConfig {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
  videoId: string
  notificationUrl: string
}

export interface UploadProgress {
  bytesUploaded: number
  totalBytes: number
}

export async function uploadInChunks(
  file: File,
  config: ChunkedUploadConfig,
  onProgress?: (progress: UploadProgress) => void,
  options?: { resumeFromBytes?: number },
): Promise<void> {
  const totalBytes = file.size
  const uploadId = config.videoId
  const startByte = options?.resumeFromBytes ?? 0

  if (startByte >= totalBytes) return

  const buildFormData = (chunk: Blob): FormData => {
    const fd = new FormData()
    fd.append("file", chunk)
    fd.append("api_key", config.apiKey)
    fd.append("timestamp", String(config.timestamp))
    fd.append("signature", config.signature)
    fd.append("folder", config.folder)
    fd.append("public_id", config.videoId)
    fd.append("eager", "sp_hd")
    fd.append("eager_async", "1")
    fd.append("notification_url", config.notificationUrl)
    return fd
  }

  for (let start = startByte; start < totalBytes; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, totalBytes)
    const chunk = file.slice(start, end)

    const formData = buildFormData(chunk)

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (_e) => {
        onProgress?.({ bytesUploaded: start, totalBytes })
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.({ bytesUploaded: end, totalBytes })
          resolve()
        } else {
          try {
            const err = JSON.parse(xhr.responseText)
            reject(new Error(err.error?.message ?? "Upload failed"))
          } catch {
            reject(new Error("Upload failed"))
          }
        }
      })

      xhr.addEventListener("error", () => reject(new Error("Upload failed")))
      xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")))

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`,
      )
      xhr.setRequestHeader("X-Unique-Upload-Id", uploadId)
      xhr.setRequestHeader("Content-Range", `bytes ${start}-${end - 1}/${totalBytes}`)
      xhr.send(formData)
    })
  }
}
