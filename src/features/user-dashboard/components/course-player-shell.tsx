"use client"

import { useCallback, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useRouter, notFound } from "next/navigation"
import { Skeleton } from "@/shared/ui/skeleton"
import { apiFetch, ApiError } from "@/shared/lib/api-fetch"
import {
  ErrorState,
  ErrorStateDescription,
} from "@/shared/ui/error-state"
import { CoursePlayerContent } from "@/features/user-dashboard/components/course-player-content"
import { CourseModuleSidebar } from "@/features/user-dashboard/components/course-module-sidebar"
import type { CourseApiResponse } from "@/features/courses/types"

function extractText(input: unknown): string {
  if (typeof input !== "string") return ""
  try {
    const parsed = JSON.parse(input) as {
      content?: { text?: string; content?: unknown[] }[]
    }
    if (!parsed.content) return ""
    const texts: string[] = []
    function walk(nodes: { text?: string; content?: unknown[] }[]) {
      for (const node of nodes) {
        if (node?.text) texts.push(node.text)
        if (node?.content) walk(node.content as typeof nodes)
      }
    }
    walk(parsed.content)
    return texts.join(" ").trim()
  } catch {
    return input
  }
}

export function CoursePlayerShell({ courseId }: { courseId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedTopicId = searchParams.get("topicId")

  const onSelectTopic = useCallback(
    (topicId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("topicId", topicId)
      params.delete("t")
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const {
    data: course,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      let json: CourseApiResponse
      try {
        json = await apiFetch<CourseApiResponse>(`/api/courses/${courseId}`)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return null
        throw err
      }

      const reviews = json.reviews ?? []
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

      return {
        id: json.id,
        title: json.title,
        overview: extractText(json.overview),
        thumbnailUrl: json.thumbnailUrl,
        language: json.language,
        level: json.level,
        duration: json.duration ? Number(json.duration) : null,
        durationUnit: json.durationUnit ?? "Hours",
        avgRating,
        reviewCount: reviews.length,
        enrollmentCount: Number(json.enrollmentCount ?? 0),
        tutor: {
          name: json.instructorName ?? null,
          image: json.instructorImage ?? null,
          specialty: json.instructorSpecialty ?? null,
          about: json.aboutInstructor ?? null,
        },
        modules: (json.modules ?? []).map((m) => ({
          id: m.id,
          title: m.title,
          sortOrder: m.order,
          topics: (m.topics ?? []).map((t) => ({
            id: t.id,
            title: t.title,
            format: t.type === "video_and_text" ? "video" : (t.type ?? "video"),
            videoId: t.videoId ?? null,
            duration: t.videoDuration ?? null,
            content:
              typeof t.description === "string"
                ? t.description
                : t.description
                  ? JSON.stringify(t.description)
                  : null,
          })),
        })),
        reviews: json.reviews ?? [],
      }
    },
    enabled: !!courseId,
  })
  useEffect(() => {
    if (course && !selectedTopicId) {
      const firstTopic = course.modules?.[0]?.topics?.[0]
      if (firstTopic) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("topicId", firstTopic.id)
        router.replace(`?${params.toString()}`, { scroll: false })
      }
    }
  }, [course, selectedTopicId, searchParams, router])

  if (isPending) {
    return (
      <div className="mx-auto py-8">
        <div className="grid gap-0 md:grid-cols-[2.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <Skeleton className="aspect-video w-full rounded-xl" />

            <div className="mx-3 flex gap-6 border-b border-border pb-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>

            <div className="mt-10 flex min-h-125 flex-col gap-7.5 px-4 lg:ml-[calc(max(100px,(100vw-1080px)/2))] lg:w-[600px] lg:px-0">
              <div>
                <Skeleton className="h-8 w-3/4" />
              </div>

              <div className="flex flex-col gap-5">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-5 rounded-2xl bg-ma-surface-2 p-4">
                  <Skeleton className="h-[190px] w-[106px] shrink-0 rounded-[10px] sm:w-[190px]" />
                  <div className="flex w-full flex-col gap-4 sm:gap-[22px]">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex flex-nowrap items-center gap-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="border border-ma-border-light bg-white px-2 py-5">
            <Skeleton className="h-8 w-44" />
            <div className="mt-5 flex flex-col gap-3">
              {[1, 2, 3].map((mod) => (
                <div
                  key={mod}
                  className="border-b border-b-border last:border-b-0"
                >
                  <div className="flex w-full items-center justify-between px-5 py-3">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-44" />
                      <div className="mt-2">
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                    <Skeleton className="size-4 shrink-0" />
                  </div>
                  <div className="flex flex-col gap-1 border-t border-border py-2">
                    {[1, 2, 3].map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-3 rounded-lg px-5 py-2"
                      >
                        <Skeleton className="size-5 shrink-0" />
                        <div className="flex w-full flex-col gap-1">
                          <Skeleton className="h-5 w-40" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="size-4 shrink-0" />
                            <Skeleton className="h-3 w-10" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState>
        <ErrorStateDescription className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load course."}
        </ErrorStateDescription>
      </ErrorState>
    )
  }

  if (!course) notFound()

  return (
    <div className="mx-auto pt-8">
      <div className="grid gap-0 md:grid-cols-[2.2fr_0.8fr]">
        <CoursePlayerContent
          course={course}
          selectedTopicId={selectedTopicId}
          onSelectTopic={onSelectTopic}
        />
        <CourseModuleSidebar
          course={course}
          selectedTopicId={selectedTopicId}
          onSelectTopic={onSelectTopic}
        />
      </div>
    </div>
  )
}
