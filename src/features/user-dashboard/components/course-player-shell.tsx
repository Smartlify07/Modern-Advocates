"use client"

import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { Skeleton } from "@/shared/ui/skeleton"
import { CoursePlayerContent } from "@/features/user-dashboard/components/course-player-content"
import { CourseModuleSidebar } from "@/features/user-dashboard/components/course-module-sidebar"

type ApiTopic = {
  id: string
  title: string
  type: string
  description: unknown
  order: number
}
type ApiModule = {
  id: string
  title: string
  order: number
  topics: ApiTopic[]
}
type ApiReview = {
  id: string
  body: string | null
  rating: number
  studentName: string | null
  studentImage: string | null
}

export function CoursePlayerShell({ courseId }: { courseId: string }) {
  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const r = await fetch(`/api/courses/${courseId}`)
      if (!r.ok) throw new Error("Failed to fetch course")
      const json = await r.json()
      function extractText(input: unknown): string {
        if (typeof input !== "string") return ""
        try {
          const parsed = JSON.parse(input) as { content?: { text?: string; content?: unknown[] }[] }
          if (!parsed.content) return ""
          const texts: string[] = []
          function walk(nodes: { text?: string; content?: unknown[] }[]) {
            for (const node of nodes) {
              if (node.text) texts.push(node.text)
              if (node.content) walk(node.content as typeof nodes)
            }
          }
          walk(parsed.content)
          return texts.join(" ").trim()
        } catch { return input }
      }

      return {
        id: json.id,
        title: json.title,
        overview: extractText(json.overview),
        thumbnailUrl: json.thumbnailUrl,
        language: json.language,
        level: json.level,
        duration: json.duration ? Number(json.duration) : null,
        avgRating: Number(json.avgRating ?? 0),
        reviewCount: Number(json.reviewCount ?? 0),
        enrollmentCount: Number(json.enrollmentCount ?? 0),
        tutor: { name: json.tutorName, image: json.tutorImage },
        modules: (json.modules ?? []).map((m: ApiModule) => ({
          id: m.id,
          title: m.title,
          sortOrder: m.order ?? 0,
          topics: (m.topics ?? []).map((t: ApiTopic) => ({
            id: t.id,
            title: t.title,
            format: t.type === "video_and_text" ? "video" : (t.type ?? "video"),
            content:
              typeof t.description === "string"
                ? t.description
                : t.description
                  ? JSON.stringify(t.description)
                  : null,
          })),
        })),
        reviews: (json.reviews ?? []).map((r: ApiReview) => ({
          id: r.id,
          body: r.body,
          rating: r.rating,
          studentName: r.studentName,
          studentImage: r.studentImage,
        })),
      }
    },
    enabled: !!courseId,
  })

  if (isLoading) {
    return (
      <div className="mx-auto py-8">
        <div className="grid gap-0 md:grid-cols-[2.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <Skeleton className="aspect-video w-full rounded-xl" />

            <div className="mx-3 flex gap-6 border-b border-[#e5e7eb] pb-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>

            <div className="mt-10 flex min-h-125 flex-col gap-7.5 px-4 lg:ml-[calc(max(100px,(100vw-1080px)/2))] lg:w-[600px] lg:px-0">
              <div>
                <Skeleton className="h-8 w-3/4" />
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              <div className="w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 pt-4 pr-3.5 pb-[25px]">
                <Skeleton className="h-7 w-48" />
                <div className="mt-6 flex flex-col">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between gap-4 py-0">
                        <div className="inline-flex items-center gap-2">
                          <Skeleton className="size-5 shrink-0" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div
                        className={
                          i < 4
                            ? "my-4 border-t border-dashed border-[#d9d9d9]"
                            : "mt-4 border-t border-dashed border-[#d9d9d9]"
                        }
                      />
                    </div>
                  ))}
                  <div className="mt-6">
                    <Skeleton className="h-[53px] w-full rounded-[60px]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-5 rounded-2xl bg-[#f5f5f5] p-4">
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

          <aside className="border border-[#d9d9d9] bg-white px-2 py-5">
            <Skeleton className="h-8 w-44" />
            <div className="mt-5 flex flex-col gap-3">
              {[1, 2, 3].map((mod) => (
                <div key={mod} className="border-b border-b-[#e5e7eb] last:border-b-0">
                  <div className="flex w-full items-center justify-between px-5 py-3">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-44" />
                      <div className="mt-2">
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                    <Skeleton className="size-4 shrink-0" />
                  </div>
                  <div className="flex flex-col gap-1 border-t border-[#e5e7eb] py-2">
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
      <div className="mx-auto flex items-center justify-center py-20">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load course."}
        </p>
      </div>
    )
  }

  if (!course) notFound()

  return (
    <div className="mx-auto py-8">
      <div className="grid gap-0 md:grid-cols-[2.2fr_0.8fr]">
        <CoursePlayerContent course={course} />
        <CourseModuleSidebar course={course} />
      </div>
    </div>
  )
}
