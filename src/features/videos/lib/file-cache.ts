const fileCache = new Map<string, File>()

export function cacheFile(uploadId: string, file: File): void {
  fileCache.set(uploadId, file)
}

export function getCachedFile(uploadId: string): File | undefined {
  return fileCache.get(uploadId)
}

export function removeCachedFile(uploadId: string): void {
  fileCache.delete(uploadId)
}
