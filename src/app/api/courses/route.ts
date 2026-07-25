import { NextResponse } from "next/server"
import { desc, eq } from "drizzle-orm"
import { db } from "@/infrastructure/database/client"
import {
  courses,
  courseModules,
  courseTopics,
} from "@/infrastructure/database/schema/course"
import { requireInstructorOrAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { updateCourseSchema } from "@/features/courses/schemas"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    const { user: sessionUser } = await requireInstructorOrAdmin()

    const list = await db
      .select({
        id: courses.id,
        title: courses.title,
        level: courses.level,
        status: courses.status,
        price: courses.price,
        discountedPrice: courses.discountedPrice,
        isFree: courses.isFree,
        thumbnailUrl: courses.thumbnailUrl,
        tutorId: courses.tutorId,
        instructorName: courses.instructorName,
        createdAt: courses.createdAt,
      })
      .from(courses)
      .orderBy(desc(courses.createdAt))

    const filtered = sessionUser.role === "admin" || sessionUser.role === "manager"
      ? list
      : list.filter((c) => c.status === "published" || c.tutorId === sessionUser.id)

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
    const parsed = updateCourseSchema.safeParse(body)

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
      duration,
      durationUnit,
      instructorName,
      instructorSpecialty,
      aboutInstructor,
      instructorImage,
      price,
      discountedPrice,
      isFree,
      language,
      status,
      thumbnailUrl,
      modules: modulesData,
    } = parsed.data

    if (status === "published") {
      if (!title) return NextResponse.json({ error: "Title is required to publish" }, { status: 400 })
      if (!level) return NextResponse.json({ error: "Level is required to publish" }, { status: 400 })
    }

    const course = await db.transaction(async (tx) => {
      const [course] = await tx
        .insert(courses)
        .values({
          title,
          content: overview,
          overview,
          duration,
          durationUnit,
          instructorName,
          instructorSpecialty,
          aboutInstructor,
          instructorImage,
          language: language ?? "en",
          level,
          price: isFree ? 0 : (price ?? 0),
          discountedPrice: isFree ? null : (discountedPrice ?? null),
          isFree: isFree ?? false,
          status: status ?? "draft",
          thumbnailUrl,
          tutorId: user.id,
        })
        .returning()

      if (!course) throw new Error("Failed to create course")

      const createdModules = []
      for (const mod of modulesData ?? []) {
        if (!mod.title) continue

        const [module] = await tx
          .insert(courseModules)
          .values({
            courseId: course.id,
            title: mod.title,
            sortOrder: mod.order ?? 0,
          })
          .returning()

        const createdTopics = []
        for (const topic of mod.topics ?? []) {
          if (!topic.title) continue

          const [created] = await tx
            .insert(courseTopics)
            .values({
              moduleId: module.id,
              title: topic.title,
              format:
                topic.type === "video_and_text"
                  ? "video"
                  : (topic.type ?? "text"),
              content: topic.description
                ? JSON.stringify(topic.description)
                : null,
              sortOrder: topic.order ?? 0,
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
