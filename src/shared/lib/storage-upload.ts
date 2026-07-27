export interface StorageUploadConfig {
  uploadUrl: string
  publicUrl: string
  videoId: string
  storageKey: string
}

export interface UploadProgress {
  bytesUploaded: number
  totalBytes: number
}

export async function uploadToStorage(
  file: File,
  config: StorageUploadConfig,
  onProgress?: (progress: UploadProgress) => void,
  options?: { timeout?: number },
): Promise<void> {
  const totalBytes = file.size

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.timeout = options?.timeout ?? 7_200_000

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.({
          bytesUploaded: e.loaded,
          totalBytes,
        })
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({ bytesUploaded: totalBytes, totalBytes })
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener("error", () => reject(new Error("Upload failed")))
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")))
    xhr.addEventListener("timeout", () => reject(new Error("Upload timed out")))

    xhr.open("PUT", config.uploadUrl)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.send(file)
  })
}
