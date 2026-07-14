import { Suspense } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"
import { validate as isValidUUID } from "uuid"
import { auth } from "@/infrastructure/auth/auth"
import { db } from "@/infrastructure/database/client"
import { enrollments } from "@/infrastructure/database/schema/course"
import { CheckoutContent } from "@/features/user-dashboard/components/checkout-content"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const raw = await searchParams
  const rawCourseId = raw.courseId
  const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : (typeof rawCourseId === "string" ? rawCourseId : undefined)

  if (courseId && isValidUUID(courseId)) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session) {
      const existing = await db
        .select({ id: enrollments.id })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.studentId, session.user.id),
            eq(enrollments.courseId, courseId),
            eq(enrollments.status, "active")
          )
        )
        .then((r) => r[0])

      if (existing) redirect(`/my-learning/${courseId}`)
    }
  }

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
      <Suspense fallback={<p className="mt-8 text-lg text-[#6b7280]">Loading...</p>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
