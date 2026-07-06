import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import {
  courses,
  courseModules,
  courseTopics,
} from "@/infrastructure/database/schema/course"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { createCourseSchema } from "@/features/courses/schemas"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    const { user } = await requireInstructorOrAdmin()

    const list = await db
      .select({
        id: courses.id,
        title: courses.title,
        level: courses.level,
        status: courses.status,
        price: courses.price,
        tutorId: courses.tutorId,
        createdAt: courses.createdAt,
      })
      .from(courses)
      .orderBy(desc(courses.createdAt))

    const filtered = user.role === "admin"
      ? list
      : list.filter((c) => c.status === "published" || c.tutorId === user.id)

    return NextResponse.json(filtered)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireInstructorOrAdmin()

    const body = await request.json()
    const parsed = createCourseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const {
      title,
      overview,
      level,
      price,
      discountedPrice,
      isFree,
      language,
      status,
      thumbnailUrl,
      modules: modulesData = [],
    } = parsed.data

    const course = await db.transaction(async (tx) => {
      const [course] = await tx
        .insert(courses)
        .values({
          title,
          content: overview,
          overview,
          language,
          level,
          price: isFree ? 0 : price,
          discountedPrice: isFree ? null : discountedPrice,
          isFree: isFree ?? false,
          status,
          thumbnailUrl,
          tutorId: user.id,
        })
        .returning()

      if (!course) throw new Error("Failed to create course")

      const createdModules = []
      for (const mod of modulesData) {
        const [module] = await tx
          .insert(courseModules)
          .values({
            courseId: course.id,
            title: mod.title,
            sortOrder: mod.order,
          })
          .returning()

        const createdTopics = []
        for (const topic of mod.topics ?? []) {
          const [created] = await tx
            .insert(courseTopics)
            .values({
              moduleId: module.id,
              title: topic.title,
              format: topic.type === "video_and_text" ? "video" : topic.type,
              content: topic.description ? JSON.stringify(topic.description) : null,
              sortOrder: topic.order,
            })
            .returning()

          createdTopics.push({
            ...created,
            clientId: topic.id,
          })
        }

        createdModules.push({
          ...module,
          clientId: mod.id,
          topics: createdTopics,
        })
      }

      return { ...course, modules: createdModules }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    Sentry.captureException(error)
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
