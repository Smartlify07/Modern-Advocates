export function getVideoDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(Math.round(video.duration))
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    video.src = url
  })
}
