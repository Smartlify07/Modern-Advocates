"use client"

import { useRef, useEffect } from "react"
import { Skeleton } from "@/shared/ui/skeleton"

interface VideoPlayerProps {
  playbackUrl: string | null
  thumbnailUrl: string | null
  videoId: string
  initialTime?: number
  onPause?: (watchedSeconds: number) => void
}

export function VideoPlayer({
  playbackUrl,
  thumbnailUrl,
  videoId,
  initialTime,
  onPause,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const initialised = useRef(false)

  useEffect(() => {
    initialised.current = false
  }, [videoId])

  useEffect(() => {
    if (initialTime && videoRef.current && !initialised.current) {
      videoRef.current.currentTime = initialTime
      initialised.current = true
    }
  }, [videoId, initialTime])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !onPause) return

    const handler = () => onPause(Math.floor(video.currentTime))
    video.addEventListener("pause", handler)

    const flush = () => {
      if (!video.paused) onPause(Math.floor(video.currentTime))
    }
    const onVisibility = () => { if (document.hidden) flush() }
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("beforeunload", flush)

    return () => {
      video.removeEventListener("pause", handler)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("beforeunload", flush)
    }
  }, [onPause])

  if (!playbackUrl) {
    return (
      <div className="aspect-video bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return (
    <div className="aspect-video overflow-hidden bg-black">
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
