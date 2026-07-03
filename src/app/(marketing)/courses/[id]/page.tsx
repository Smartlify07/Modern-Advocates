import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { CourseDetailHeroSection } from "@/features/marketing/components/course-detail-hero-section"
import { CourseDetailContentSection } from "@/features/marketing/components/course-detail-content-section"

async function fetchCourse(id: string) {
  const host = (await headers()).get("host") ?? "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const res = await fetch(`${protocol}://${host}/api/courses/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const course = await fetchCourse(id)

  if (!course) notFound()

  const courseData = {
    id: course.id,
    title: course.title,
    tutorName: course.tutorName,
    content: course.content,
    overview: course.overview,
    thumbnailUrl: course.thumbnailUrl,
    language: course.language,
    level: course.level,
    price: Number(course.price),
    discountedPrice: course.discountedPrice
      ? Number(course.discountedPrice)
      : null,
    duration: course.duration,
    tutor: {
      name: course.tutorName,
      image: course.tutorImage,
    },
    avgRating: Number(course.avgRating),
    reviewCount: Number(course.reviewCount),
    enrollmentCount: Number(course.enrollmentCount),
    modules: (course.modules ?? []).map(
      (m: {
        id: string
        title: string
        order: number
        topics: {
          id: string
          title: string
          type: string
          description: unknown
          order: number
        }[]
      }) => ({
        id: m.id,
        title: m.title,
        sortOrder: m.order,
        topics: (m.topics ?? []).map(
          (t: {
            id: string
            title: string
            type: string
            description: unknown
            order: number
          }) => ({
            id: t.id,
            title: t.title,
            format: t.type === "video_and_text" ? "video" : t.type,
            content:
              typeof t.description === "string"
                ? t.description
                : t.description
                  ? JSON.stringify(t.description)
                  : null,
          }),
        ),
      }),
    ),
    reviews: (course.reviews ?? []).map(
      (r: {
        id: string
        body: string | null
        rating: number
        studentName: string | null
        studentImage: string | null
      }) => ({
        id: r.id,
        body: r.body,
        rating: r.rating,
        studentName: r.studentName,
        studentImage: r.studentImage,
      }),
    ),
  }

  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <CourseDetailHeroSection course={courseData} />
      <CourseDetailContentSection course={courseData} />
    </main>
  )
}
