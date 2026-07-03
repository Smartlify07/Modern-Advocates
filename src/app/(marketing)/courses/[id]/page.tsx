import { notFound } from "next/navigation"
import { eq, and, sql, inArray } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { user } from "@/infrastructure/database/schema/auth"
import {
  courses,
  courseModules,
  courseTopics,
  reviews,
  enrollments,
} from "@/infrastructure/database/schema/course"
import { CourseDetailHeroSection } from "@/features/marketing/components/course-detail-hero-section"
import { CourseDetailContentSection } from "@/features/marketing/components/course-detail-content-section"

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const courseResult = await db
    .select({
      id: courses.id,
      title: courses.title,
      content: courses.content,
      overview: courses.overview,
      thumbnailUrl: courses.thumbnailUrl,
      language: courses.language,
      level: courses.level,
      price: courses.price,
      discountedPrice: courses.discountedPrice,
      duration: courses.duration,
      tutorName: user.name,
      tutorImage: user.image,
    })
    .from(courses)
    .where(and(eq(courses.id, id), eq(courses.status, "published")))
    .innerJoin(user, eq(courses.tutorId, user.id))
    .limit(1)

  if (courseResult.length === 0) notFound()

  const course = courseResult[0]

  const modules = await db
    .select()
    .from(courseModules)
    .where(eq(courseModules.courseId, id))
    .orderBy(courseModules.sortOrder)

  const moduleIds = modules.map((m) => m.id)
  const allTopics =
    moduleIds.length > 0
      ? await db
          .select()
          .from(courseTopics)
          .where(inArray(courseTopics.moduleId, moduleIds))
          .orderBy(courseTopics.sortOrder)
      : []

  const topicsByModule = new Map<string, typeof allTopics>()
  for (const topic of allTopics) {
    const existing = topicsByModule.get(topic.moduleId) ?? []
    existing.push(topic)
    topicsByModule.set(topic.moduleId, existing)
  }

  const courseReviews = await db
    .select({
      id: reviews.id,
      body: reviews.body,
      rating: reviews.rating,
      studentName: user.name,
      studentImage: user.image,
    })
    .from(reviews)
    .where(eq(reviews.courseId, id))
    .innerJoin(user, eq(reviews.studentId, user.id))

  const enrollmentResult = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(enrollments)
    .where(eq(enrollments.courseId, id))

  const enrollmentCount = enrollmentResult[0]?.count ?? 0

  const avgRating =
    courseReviews.length > 0
      ? courseReviews.reduce((sum, r) => sum + r.rating, 0) /
        courseReviews.length
      : 0

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
    avgRating,
    reviewCount: courseReviews.length,
    enrollmentCount,
    modules: modules.map((m) => ({
      id: m.id,
      title: m.title,
      sortOrder: m.sortOrder,
      topics: (topicsByModule.get(m.id) ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        format: t.format,
        content: t.content,
      })),
    })),
    reviews: courseReviews.map((r) => ({
      id: r.id,
      body: r.body,
      rating: r.rating,
      studentName: r.studentName,
      studentImage: r.studentImage,
    })),
  }

  return (
    <main className="min-h-svh overflow-hidden bg-white text-ma-text">
      <CourseDetailHeroSection course={courseData} />
      <CourseDetailContentSection course={courseData} />
    </main>
  )
}
