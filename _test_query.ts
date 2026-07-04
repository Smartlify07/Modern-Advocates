import { db } from "./src/infrastructure/database/client"
import { eq, sql } from "drizzle-orm"
import { courses, reviews } from "./src/infrastructure/database/schema/course"
import { user } from "./src/infrastructure/database/schema/auth"

async function main() {
  const course = await db
    .select({ id: courses.id })
    .from(courses)
    .limit(1)
    .then((r) => r[0])

  if (!course) {
    console.log("No courses found")
    return
  }

  console.log("Testing with course ID:", course.id)

  // Test with raw column name string (no drizzle column reference)
  try {
    const r = await db
      .select({
        id: reviews.id,
        body: reviews.body,
        rating: reviews.rating,
        studentName: user.name,
        studentImage: user.image,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.studentId, user.id))
      .where(sql`"reviews"."course_id"::text = ${course.id}`)

    console.log("Reviews query OK —", r.length, "reviews")
  } catch (e) {
    console.error("Reviews query FAILED:", e)
  }

  // Test with cast on parameter
  try {
    const r = await db
      .select({
        id: reviews.id,
        body: reviews.body,
        rating: reviews.rating,
        studentName: user.name,
        studentImage: user.image,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.studentId, user.id))
      .where(sql`${reviews.courseId}::text = cast(${course.id} as text)`)

    console.log("Reviews with CAST param OK —", r.length, "reviews")
  } catch (e) {
    console.error("Reviews with CAST param FAILED:", e)
  }
}

main()
