import { NextResponse, type NextRequest } from "next/server"
import { eq, and } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { enrollments } from "@/infrastructure/database/schema/course"
import { requireSession } from "@/infrastructure/auth/helpers"
import { isValidUuid } from "@/shared/utils"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> },
  ) => {
    const { user: currentUser } = await requireSession()
    const { courseId } = await params

    if (!isValidUuid(courseId)) {
      return NextResponse.json({ enrolled: false })
    }

    const enrollment = await db
      .select({ id: enrollments.id, status: enrollments.status })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, currentUser.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .then((r) => r[0] ?? null)

    const enrolled = enrollment?.status === "active"

    return NextResponse.json({ enrolled })
  },
)
