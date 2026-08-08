import { NextResponse } from "next/server"
import { eq, sql, desc } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { courses, reviews } from "@/infrastructure/database/schema/course"
import { apiHandler } from "@/shared/lib/api-handler"
import { resolveStoredUrl } from "@/infrastructure/storage/service"

export const dynamic = "force-dynamic"

export const GET = apiHandler(async () => {
  const featured = await db
    .select({
      id: courses.id,
      title: courses.title,
      overview: courses.overview,
      thumbnailUrl: courses.thumbnailUrl,
      thumbnailKey: courses.thumbnailKey,
      level: courses.level,
      price: courses.price,
      discountedPrice: courses.discountedPrice,
      duration: courses.duration,
      instructorName: courses.instructorName,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      reviewCount: sql<number>`COUNT(${reviews.id})`,
    })
    .from(courses)
    .where(eq(courses.status, "published"))
    .leftJoin(reviews, eq(reviews.courseId, courses.id))
    .groupBy(courses.id, courses.title, courses.overview, courses.thumbnailUrl, courses.thumbnailKey, courses.level, courses.price, courses.discountedPrice, courses.duration)
    .orderBy(desc(courses.createdAt))

  const resolved = await Promise.all(
    featured.map(async ({ thumbnailKey, ...course }) => ({
      ...course,
      thumbnailUrl: await resolveStoredUrl(thumbnailKey, course.thumbnailUrl),
    })),
  )

  return NextResponse.json(resolved)
})
