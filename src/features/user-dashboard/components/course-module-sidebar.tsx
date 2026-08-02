"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, VideoIcon } from "lucide-react"
import { apiFetch } from "@/shared/lib/api-fetch"
import { formatDurationFromSeconds } from "@/shared/utils"

type Topic = {
  id: string
  title: string
  format?: string
  duration?: number | null
  content?: string | null
}
type Module = { id: string; title: string; sortOrder: number; topics: Topic[] }
type Tutor = { name: string | null; image: string | null }
type CourseData = {
  id: string
  title: string
  overview: string | null
  thumbnailUrl: string | null
  duration: number | null
  level: string
  language: string
  avgRating: number
  reviewCount: number
  enrollmentCount: number
  tutor: Tutor
  modules: Module[]
  reviews: Array<{
    id: string
    body: string | null
    rating: number
    studentName: string | null
    studentImage: string | null
  }>
}

export function CourseModuleSidebar({
  course,
  selectedTopicId,
  onSelectTopic,
}: {
  course: CourseData
  selectedTopicId: string | null
  onSelectTopic?: (topicId: string) => void
}) {
  const courseId = course.id
  const queryClient = useQueryClient()
  const queryKey = ["enrollment-progress", courseId]
  const modules = course.modules

  const [openWeeks, setOpenWeeks] = useState<Set<string>>(
    new Set([modules[0]?.id])
  )

  const { data: enrollment } = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<{
        id: string
        progress: number
        completedTopicIds: string[]
      }>(`/api/enrollments/by-course/${courseId}`),
    enabled: !!courseId,
  })

  const completedTopicIds = enrollment?.completedTopicIds ?? []

  const totalTopics = (modules ?? []).reduce(
    (sum, mod) => sum + mod.topics.length,
    0
  )

  const toggleMutation = useMutation({
    mutationFn: ({
      enrollmentId,
      topicId,
    }: {
      enrollmentId: string
      topicId: string
    }) =>
      apiFetch<{ completed: boolean; progress: number }>(
        `/api/enrollments/${enrollmentId}/topics/${topicId}`,
        {
          method: "POST",
        }
      ),
    onMutate: async ({ topicId }) => {
      await queryClient.cancelQueries({ queryKey })

      const prev = queryClient.getQueryData<{
        id: string
        progress: number
        completedTopicIds: string[]
      }>(queryKey)

      if (prev) {
        const toggledOn = !prev.completedTopicIds.includes(topicId)
        const nextCount = toggledOn
          ? prev.completedTopicIds.length + 1
          : prev.completedTopicIds.length - 1
        const optimisticProgress =
          totalTopics > 0 ? Math.round((nextCount / totalTopics) * 100) : 0
        const nextCompletedIds = toggledOn
          ? [...prev.completedTopicIds, topicId]
          : prev.completedTopicIds.filter((id) => id !== topicId)

        queryClient.setQueryData(queryKey, {
          ...prev,
          progress: optimisticProgress,
          completedTopicIds: nextCompletedIds,
        })
      }

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const formatDuration = formatDurationFromSeconds

  const toggleLesson = (topicId: string) => {
    if (!enrollment?.id) return
    toggleMutation.mutate({ enrollmentId: enrollment.id, topicId })
  }

  const toggleWeek = (id: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <aside className="sticky top-0 self-start h-screen overflow-y-auto border border-ma-border-light bg-white px-2 py-5">
      <h2 className="text-2xl font-bold text-ma-text">Course Module</h2>

      <div className="mt-5 flex flex-col gap-3">
        {(modules ?? []).map((mod) => {
          const modTopics = mod.topics ?? []
          const isOpen = openWeeks.has(mod.id)
          const total = modTopics.length
          const done = modTopics.filter((t) => completedTopicIds.includes(t.id)).length
          const weekLabel = `Week ${mod.sortOrder + 1}: ${mod.title}`

          return (
            <div
              key={mod.id}
              className="border-b border-b-border last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleWeek(mod.id)}
                className="flex w-full items-center justify-between px-5 py-3 text-left"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ma-text 2xl:text-base">
                    {weekLabel}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground 2xl:text-sm">
                    {done}/{total} |{" "}
                    {modTopics.some((t) => t.duration)
                      ? formatDuration(
                          modTopics.reduce(
                            (acc, t) => acc + (t.duration ?? 0),
                            0
                          )
                        )
                      : "n/a"}
                  </p>
                </div>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-1 border-t border-border py-2">
                  {modTopics.map((topic) => {
                    const isSelected = selectedTopicId === topic.id
                    return (
                      <div
                        key={topic.id}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === " ") && topic.id) {
                            e.preventDefault()
                            onSelectTopic?.(topic.id)
                          }
                        }}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-5 py-2 hover:bg-muted ${isSelected ? "bg-muted" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={completedTopicIds.includes(topic.id)}
                          onChange={() => toggleLesson(topic.id)}
                          className="size-5 accent-primary"
                        />
                        <div
                          className="flex flex-1 flex-col gap-1"
                          onClick={() => onSelectTopic?.(topic.id)}
                        >
                          <div
                            className={`flex-1 text-sm 2xl:text-base ${isSelected ? "font-semibold text-primary" : "text-ma-text"}`}
                          >
                            {topic.title}
                          </div>
                          <div className="flex items-center gap-2">
                            <VideoIcon className="size-4 text-muted-foreground" />
                            <span className="text-xs text-primary">
                              {topic.duration
                                ? formatDuration(topic.duration)
                                : "n/a"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
