"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import { VideoPlayer } from "@/features/videos/components/video-player"
import { TutorCard } from "@/features/marketing/components/tutor-card"
import { ReviewCard } from "@/features/marketing/components/review-card"
import { Skeleton } from "@/shared/ui/skeleton"
import { apiFetch } from "@/shared/lib/api-fetch"
import { authClient } from "@/infrastructure/auth/client"

type Topic = {
  id: string
  title: string
  format: string
  videoId: string | null
  content: string | null
}
type Module = { id: string; title: string; sortOrder: number; topics: Topic[] }
type Review = {
  id: string
  body: string | null
  rating: number
  studentId: string
  studentName: string | null
  studentImage: string | null
}
type Tutor = {
  name: string | null
  image: string | null
  specialty: string | null
  about: string | null
}

type CourseData = {
  id: string
  title: string
  overview: string | null
  thumbnailUrl: string | null
  duration: number | null
  durationUnit: string | null
  level: string
  language: string
  avgRating: number
  reviewCount: number
  enrollmentCount: number
  tutor: Tutor
  modules: Module[]
  reviews: Review[]
}

export function CoursePlayerContent({
  course,
  selectedTopicId,
  onSelectTopic,
}: {
  course: CourseData
  selectedTopicId: string | null
  onSelectTopic?: (topicId: string) => void
}) {
  const [tab, setTab] = useState<"overview" | "reviews">("overview")
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const myReviews = course.reviews.filter(
    (r) => r.studentId === session?.user?.id
  )

  const selectedTopic = findTopic(course.modules, selectedTopicId)
  const isVideoTopic = selectedTopic?.format === "video"

  const selectedVideoId = selectedTopic?.videoId ?? null

  const { data: video, isPending: videoPending } = useQuery({
    queryKey: ["topic-video", selectedVideoId],
    queryFn: async () => {
      if (!selectedVideoId) return null
      return apiFetch<{
        id: string
        playbackUrl: string | null
        thumbnailUrl: string | null
        duration: number | null
        status: string
        progress: { watchedSeconds: number; completed: boolean }
        title: string
        description: string | null
      }>(`/api/videos/${selectedVideoId}`)
    },
    enabled: !!selectedTopicId && isVideoTopic,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })

  const videoIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (video?.id) videoIdRef.current = video.id
  }, [video?.id])

  const initialTime = (() => {
    const t = searchParams.get("t")
    if (t) {
      const parsed = parseInt(t, 10)
      if (!isNaN(parsed) && parsed >= 0) return parsed
    }
    if (video?.progress?.watchedSeconds && video.progress.watchedSeconds > 0) {
      return video.progress.watchedSeconds
    }
    return undefined
  })()

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollment-progress", course.id],
    queryFn: () =>
      apiFetch<{
        id: string
        progress: number
        completedTopicIds: string[]
      }>(`/api/enrollments/by-course/${course.id}`),
    enabled: !!course.id,
    staleTime: 30 * 60 * 1000,
  })

  const completedTopicIds = enrollmentData?.completedTopicIds ?? []

  const isCompleted = selectedTopicId
    ? completedTopicIds.includes(selectedTopicId)
    : false

  const { prev: prevTopicId, next: nextTopicId } = getAdjacentTopics(
    course.modules,
    selectedTopicId
  )

  const handleCompleteToggle = useCallback(async () => {
    if (!selectedTopicId || !enrollmentData?.id) return

    try {
      await apiFetch(
        `/api/enrollments/${enrollmentData.id}/topics/${selectedTopicId}`,
        { method: "POST" },
      )
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["enrollment-progress", course.id],
      })
    }
  }, [selectedTopicId, course.id, enrollmentData?.id, queryClient])

  const handlePause = useCallback(
    (watchedSeconds: number) => {
      if (!videoIdRef.current || !video?.duration) return
      const params = new URLSearchParams(searchParams.toString())
      params.set("t", String(watchedSeconds))
      router.replace(`?${params.toString()}`, { scroll: false })

      apiFetch(`/api/videos/${videoIdRef.current}/progress`, {
        method: "POST",
        body: {
          watchedSeconds,
          duration: video.duration,
        },
      }).catch(() => {})
    },
    [video?.duration, searchParams, router]
  )

  const handleEnded = useCallback(
    async (watchedSeconds: number) => {
      if (!videoIdRef.current || !video?.duration || !selectedTopicId) return

      await apiFetch(`/api/videos/${videoIdRef.current}/progress`, {
        method: "POST",
        body: { watchedSeconds, duration: video.duration },
      })

      const enrollmentData = queryClient.getQueryData<{
        id: string
        completedTopicIds: string[]
      }>(["enrollment-progress", course.id])
      if (!enrollmentData) return

      if (!enrollmentData.completedTopicIds.includes(selectedTopicId)) {
        await apiFetch(
          `/api/enrollments/${enrollmentData.id}/topics/${selectedTopicId}`,
          { method: "POST" },
        )
      }

      queryClient.invalidateQueries({
        queryKey: ["enrollment-progress", course.id],
      })
    },
    [video?.duration, videoIdRef, selectedTopicId, course.id, queryClient]
  )

  return (
    <div className="flex flex-col gap-4">
      {selectedTopicId && isVideoTopic ? (
        !selectedVideoId ? (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
            Video not yet available
          </div>
        ) : videoPending ? (
          <Skeleton className="aspect-video w-full rounded-xl" />
        ) : video?.playbackUrl ? (
          <VideoPlayer
            playbackUrl={video.playbackUrl}
            videoId={video.id}
            initialTime={initialTime}
            onPause={handlePause}
            onEnded={handleEnded}
          />
        ) : video ? (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {video.status === "uploading"
              ? "Video is being processed..."
              : "Video not available"}
          </div>
        ) : null
      ) : selectedTopicId && selectedTopic && !isVideoTopic ? (
        <div className="border bg-white px-14 py-6">
          <h2 className="mb-4 text-xl font-bold text-ma-text">
            {selectedTopic.title}
          </h2>
          <div className="prose max-w-none text-base leading-relaxed text-primary">
            {selectedTopic.content ?? "No content available."}
          </div>
        </div>
      ) : (
        <VideoPlayer playbackUrl={null} videoId={course.id} />
      )}

      {selectedTopicId && (
        <div className="flex items-center justify-between border-b border-border px-4 pb-4 lg:px-14">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!prevTopicId}
              onClick={() => prevTopicId && onSelectTopic?.(prevTopicId)}
              className="rounded-8 border border-primary px-4 py-2 text-sm font-medium text-ma-text transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!nextTopicId}
              onClick={() => nextTopicId && onSelectTopic?.(nextTopicId)}
              className="rounded-8 border border-primary px-4 py-2 text-sm font-medium text-ma-text transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
          <button
            type="button"
            onClick={handleCompleteToggle}
            className={`rounded-8 px-6 py-2 text-sm font-medium transition-colors ${
              isCompleted
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            {isCompleted ? "Completed" : "Mark as complete"}
          </button>
        </div>
      )}

      <div className="flex gap-6 border-b border-border px-4 lg:px-14">
        <button
          onClick={() => setTab("overview")}
          className={`pb-2 text-sm font-medium ${tab === "overview" ? "border-b-2 border-ma-text text-ma-text" : "text-muted-foreground"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`pb-2 text-sm font-medium ${tab === "reviews" ? "border-b-2 border-ma-text text-ma-text" : "text-muted-foreground"}`}
        >
          Reviews
        </button>
      </div>

      <div className="my-10 grid flex-col gap-7.5 px-4 lg:px-14">
        {tab === "overview" ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {selectedTopic?.title ?? course.title}
              </h1>
            </div>
          </>
        ) : (
          <div className="grid gap-5">
            <h2 className="text-2xl font-bold text-ma-text">Student Reviews</h2>
            {myReviews.length > 0 ? (
              myReviews.map((r) => <ReviewCard key={r.id} review={r} />)
            ) : (
              <div className="w-full rounded-lg border border-ma-border-light py-12 text-center">
                <p className="text-base text-muted-foreground">No reviews yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function findTopic(
  modules: Module[],
  topicId: string | null
): Topic | undefined {
  if (!topicId) return undefined
  for (const mod of modules) {
    const found = mod.topics.find((t) => t.id === topicId)
    if (found) return found
  }
  return undefined
}

function getAdjacentTopics(
  modules: Module[],
  currentId: string | null
): { prev: string | null; next: string | null } {
  if (!currentId) return { prev: null, next: null }
  const allIds = modules.flatMap((m) => m.topics.map((t) => t.id))
  const idx = allIds.indexOf(currentId)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? allIds[idx - 1] : null,
    next: idx < allIds.length - 1 ? allIds[idx + 1] : null,
  }
}
