import { NextResponse } from "next/server"
import { eq, sql } from "drizzle-orm"

import { db } from "@/lib/db/client"
import { courses, reviews } from "@/lib/db/schema/course"
import { user } from "@/lib/db/schema/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const featured = await db
    .select({
      id: courses.id,
      title: courses.title,
      overview: courses.overview,
      thumbnailUrl: courses.thumbnailUrl,
      level: courses.level,
      price: courses.price,
      discountedPrice: courses.discountedPrice,
      duration: courses.duration,
      tutorName: user.name,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      reviewCount: sql<number>`COUNT(${reviews.id})`,
    })
    .from(courses)
    .where(eq(courses.status, "published"))
    .innerJoin(user, eq(courses.tutorId, user.id))
    .leftJoin(reviews, eq(reviews.courseId, courses.id))
    .groupBy(courses.id, courses.title, courses.overview, courses.thumbnailUrl, courses.level, courses.price, courses.discountedPrice, courses.duration, user.name)
    .limit(6)

  return NextResponse.json(featured)
}
