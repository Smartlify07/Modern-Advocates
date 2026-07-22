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
  options?: { resumeFromBytes?: number },
): Promise<void> {
  const totalBytes = file.size
  const startByte = options?.resumeFromBytes ?? 0

  if (startByte >= totalBytes) return

  const blob = startByte > 0 ? file.slice(startByte) : file

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.({
          bytesUploaded: startByte + e.loaded,
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

    xhr.open("PUT", config.uploadUrl)
    xhr.setRequestHeader("Content-Type", file.type)
    if (startByte > 0) {
      xhr.setRequestHeader("Content-Range", `bytes ${startByte}-${totalBytes - 1}/${totalBytes}`)
    }
    xhr.send(blob)
  })
}
