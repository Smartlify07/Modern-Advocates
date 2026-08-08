"use client"

import { useRef, useEffect } from "react"
import { Skeleton } from "@/shared/ui/skeleton"

interface VideoPlayerProps {
  playbackUrl: string | null
  videoId: string
  initialTime?: number
  onPause?: (watchedSeconds: number) => void
  onEnded?: (watchedSeconds: number) => void
}

export function VideoPlayer({
  playbackUrl,
  videoId,
  initialTime,
  onPause,
  onEnded,
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

  useEffect(() => {
    const video = videoRef.current
    if (!video || !onEnded) return
    const handler = () => onEnded(Math.floor(video.currentTime))
    video.addEventListener("ended", handler)
    return () => video.removeEventListener("ended", handler)
  }, [onEnded])

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
        className="h-full w-full"
        controls
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}
