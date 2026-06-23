"use client"

import { useRef, useEffect } from "react"
import { Skeleton } from "@/shared/ui/skeleton"

interface VideoPlayerProps {
  playbackUrl: string | null
  thumbnailUrl: string | null
  videoId: string
  initialTime?: number
  onProgress?: (watchedSeconds: number) => void
  progressInterval?: number
}

export function VideoPlayer({
  playbackUrl,
  thumbnailUrl,
  videoId,
  initialTime,
  onProgress,
  progressInterval = 15,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!videoRef.current || !onProgress) return

    intervalRef.current = setInterval(() => {
      const video = videoRef.current
      if (video && typeof video.currentTime === "number") {
        onProgress(Math.floor(video.currentTime))
      }
    }, progressInterval * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [onProgress, progressInterval])

  useEffect(() => {
    if (initialTime && videoRef.current) {
      videoRef.current.currentTime = initialTime
    }
  }, [initialTime])

  if (!playbackUrl) {
    return (
      <div className="aspect-video rounded-lg bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        src={playbackUrl}
        poster={thumbnailUrl ?? undefined}
        className="h-full w-full"
        controls
        playsInline
      />
    </div>
  )
}
