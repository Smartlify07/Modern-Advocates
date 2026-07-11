"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, VideoIcon } from "lucide-react"

type Topic = {
  id: string
  title: string
  format?: string
  content?: string | null
}
type Module = { id: string; title: string; sortOrder: number; topics: Topic[] }

export function CourseModuleSidebar({ modules }: { modules: Module[] }) {
  const params = useParams()
  const courseId = params.courseId as string
  const queryClient = useQueryClient()
  const queryKey = ["enrollment-progress", courseId]

  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(
    new Set([modules[0]?.id])
  )
  const seeded = useRef(false)

  const { data: enrollment } = useQuery({
    queryKey,
    queryFn: () =>
      fetch(`/api/enrollments/by-course/${courseId}`).then(
        (r) => r.json() as Promise<{ id: string; progress: number; completedTopicIds: string[] }>,
      ),
    enabled: !!courseId,
  })

  useEffect(() => {
    if (enrollment?.completedTopicIds && !seeded.current) {
      setCompleted(new Set(enrollment.completedTopicIds))
      seeded.current = true
    }
  }, [enrollment?.completedTopicIds])

  const totalTopics = modules.reduce((sum, mod) => sum + mod.topics.length, 0)

  const toggleMutation = useMutation({
    mutationFn: ({
      enrollmentId,
      topicId,
    }: {
      enrollmentId: string
      topicId: string
    }) =>
      fetch(`/api/enrollments/${enrollmentId}/topics/${topicId}`, {
        method: "POST",
      }).then((r) => r.json() as Promise<{ completed: boolean; progress: number }>),
    onMutate: async ({ topicId }) => {
      await queryClient.cancelQueries({ queryKey })

      const prev = queryClient.getQueryData<{
        id: string
        progress: number
        completedTopicIds: string[]
      }>(queryKey)

      setCompleted((prevSet) => {
        const next = new Set(prevSet)
        next.has(topicId) ? next.delete(topicId) : next.add(topicId)
        return next
      })

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
    onError: (_err, { topicId }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev)
      }
      setCompleted((prevSet) => {
        const next = new Set(prevSet)
        next.has(topicId) ? next.delete(topicId) : next.add(topicId)
        return next
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

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
    <aside className="sticky top-0 max-h-[calc(100vh-8rem)] overflow-y-auto border border-[#d9d9d9] bg-white px-2 py-5">
      <h2 className="text-2xl font-bold text-ma-text">Course Module</h2>

      <div className="mt-5 flex flex-col gap-3">
        {modules.map((mod) => {
          const isOpen = openWeeks.has(mod.id)
          const total = mod.topics.length
          const done = mod.topics.filter((t) => completed.has(t.id)).length
          const weekLabel = `Week ${mod.sortOrder + 1}: ${mod.title}`

          return (
            <div
              key={mod.id}
              className="border-b border-b-[#e5e7eb] last:border-b-0"
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
                  <p className="mt-2 text-xs text-[#6b7280] 2xl:text-sm">
                    {done}/{total} | 1 hr 30 mins
                  </p>
                </div>
                <ChevronDown
                  className={`size-4 text-[#6b7280] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-1 border-t border-[#e5e7eb] py-2">
                  {mod.topics.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-5 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={completed.has(topic.id)}
                        onChange={() => toggleLesson(topic.id)}
                        className="size-5 accent-primary"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex-1 text-sm text-ma-text 2xl:text-base">
                          {topic.title}
                        </div>
                        <div className="flex items-center gap-2">
                          <VideoIcon className="size-4 text-[#6B7280]" />
                          <span className="text-xs text-primary">30mins</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
