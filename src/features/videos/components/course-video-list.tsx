"use client"

import { useState } from "react"
import { Play, Trash2, Loader2, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"

interface VideoItem {
  id: string
  title: string
  duration: number | null
  thumbnailUrl: string | null
  status: "uploading" | "processing" | "ready" | "failed"
}

interface CourseVideoListProps {
  videos: VideoItem[]
  isInstructor?: boolean
  onPlay?: (videoId: string) => void
  onDelete?: (videoId: string) => void
}

const statusConfig: Record<
  VideoItem["status"],
  { label: string; variant: "outline" | "secondary" | "default" | "destructive"; icon: typeof Clock }
> = {
  uploading: {
    label: "Uploading",
    variant: "outline",
    icon: Loader2,
  },
  processing: {
    label: "Processing",
    variant: "secondary",
    icon: Loader2,
  },
  ready: {
    label: "Ready",
    variant: "default",
    icon: Play,
  },
  failed: {
    label: "Failed",
    variant: "destructive",
    icon: AlertCircle,
  },
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function CourseVideoList({
  videos,
  isInstructor = false,
  onPlay,
  onDelete,
}: CourseVideoListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (videos.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No videos yet
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => {
        const config = statusConfig[video.status]
        const StatusIcon = config.icon
        const isDeleting = deletingId === video.id

        return (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Badge
                variant={config.variant}
                className="absolute right-2 top-2"
              >
                <StatusIcon
                  className={`mr-1 h-3 w-3 ${video.status === "uploading" || video.status === "processing" ? "animate-spin" : ""}`}
                />
                {config.label}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="truncate font-medium">{video.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDuration(video.duration)}
              </p>

              <div className="mt-3 flex gap-2">
                {video.status === "ready" && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onPlay?.(video.id)}
                  >
                    <Play className="mr-1 h-4 w-4" />
                    Play
                  </Button>
                )}
                {isInstructor && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={async () => {
                      setDeletingId(video.id)
                      try {
                        await onDelete?.(video.id)
                      } finally {
                        setDeletingId(null)
                      }
                    }}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
