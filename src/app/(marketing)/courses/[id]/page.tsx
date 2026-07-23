import { notFound } from "next/navigation"

import { CourseDetailHeroSection } from "@/features/marketing/components/course-detail-hero-section"
import { CourseDetailContentSection } from "@/features/marketing/components/course-detail-content-section"

interface TiptapNode {
  type?: string
  text?: string
  content?: TiptapNode[]
}

function extractTextFromJson(input: unknown): string {
  if (typeof input !== "string") return ""
  try {
    const parsed: TiptapNode = JSON.parse(input)
    if (!parsed.content) return ""
    const texts: string[] = []
    function walk(nodes: TiptapNode[]) {
      for (const node of nodes) {
        if (node.text) texts.push(node.text)
        if (node.content) walk(node.content)
      }
    }
    walk(parsed.content)
    return texts.join(" ").trim()
  } catch {
    return ""
  }
}

async function fetchCourse(id: string) {
  const origin = process.env.NEXT_PUBLIC_APP_URL
  if (!origin) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured")
  }
  const res = await fetch(`${origin}/api/courses/${id}`, {
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

  const normalizedReviews = (course.reviews ?? []).map(
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
    })
  )

  const avgRating =
    normalizedReviews.length > 0
      ? normalizedReviews.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        ) / normalizedReviews.length
      : 0

  const overviewText = extractTextFromJson(course.overview ?? course.content)

  const courseData = {
    id: course.id,
    title: course.title,
    tutorName: course.tutorName,
    content: course.content,
    overview: overviewText,
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
    avgRating,
    reviewCount: normalizedReviews.length,
    enrollmentCount: Number(course.enrollmentCount ?? 0),
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
          })
        ),
      })
    ),
    reviews: normalizedReviews,
  }

  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <CourseDetailHeroSection course={courseData} />
      <CourseDetailContentSection course={courseData} />
    </main>
  )
}
