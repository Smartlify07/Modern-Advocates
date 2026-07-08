import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { CoursePlayerContent } from "@/features/user-dashboard/components/course-player-content"
import { CourseModuleSidebar } from "@/features/user-dashboard/components/course-module-sidebar"

async function fetchCourse(id: string) {
  const host = (await headers()).get("host") ?? "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const res = await fetch(`${protocol}://${host}/api/courses/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await fetchCourse(courseId)
  if (!course) notFound()

  const courseData = {
    id: course.id,
    title: course.title,
    overview: course.overview,
    thumbnailUrl: course.thumbnailUrl,
    language: course.language,
    level: course.level,
    duration: course.duration ? Number(course.duration) : null,
    avgRating: Number(course.avgRating ?? 0),
    reviewCount: Number(course.reviewCount ?? 0),
    enrollmentCount: Number(course.enrollmentCount ?? 0),
    tutor: { name: course.tutorName, image: course.tutorImage },
    modules: (course.modules ?? []).map((m: any) => ({
      id: m.id,
      title: m.title,
      sortOrder: m.order ?? 0,
      topics: (m.topics ?? []).map((t: any) => ({
        id: t.id,
        title: t.title,
        format: t.type === "video_and_text" ? "video" : (t.type ?? "video"),
        content: typeof t.description === "string" ? t.description : t.description ? JSON.stringify(t.description) : null,
      })),
    })),
    reviews: (course.reviews ?? []).map((r: any) => ({
      id: r.id,
      body: r.body,
      rating: r.rating,
      studentName: r.studentName,
      studentImage: r.studentImage,
    })),
  }

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
      <div className="grid gap-8 md:grid-cols-[65%_35%]">
        <CoursePlayerContent course={courseData} />
        <CourseModuleSidebar modules={courseData.modules} />
      </div>
    </div>
  )
}
