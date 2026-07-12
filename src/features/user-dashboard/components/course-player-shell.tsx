"use client"

import { useQuery } from "@tanstack/react-query"
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
      return {
        id: json.id,
        title: json.title,
        overview: json.overview,
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
            <div className="space-y-3 px-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-4 border border-[#d9d9d9] bg-white px-2 py-5">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
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

  if (!course) {
    return (
      <div className="mx-auto flex items-center justify-center py-20">
        <p className="text-[#6b7280]">Course not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto py-8">
      <div className="grid gap-0 md:grid-cols-[2.2fr_0.8fr]">
        <CoursePlayerContent course={course} />
        <CourseModuleSidebar course={course} />
      </div>
    </div>
  )
}
