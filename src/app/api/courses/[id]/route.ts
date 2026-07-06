import { NextResponse } from "next/server"
import { eq, asc, sql, inArray } from "drizzle-orm"

import { db } from "@/infrastructure/database/client"
import { user } from "@/infrastructure/database/schema/auth"
import {
  courses,
  courseModules,
  courseTopics,
  reviews,
  enrollments,
} from "@/infrastructure/database/schema/course"
import { courseVideos } from "@/infrastructure/database/schema/video"
import {
  requireInstructorOrAdmin,
  requireAdmin,
} from "@/infrastructure/auth/helpers"
import { updateCourseSchema } from "@/features/courses/schemas"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const course = await db
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
        status: courses.status,
        tutorId: courses.tutorId,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        tutorName: user.name,
        tutorImage: user.image,
      })
      .from(courses)
      .where(sql`"courses"."id"::text = ${id}`)
      .innerJoin(user, eq(courses.tutorId, user.id))
      .then((r) => r[0])

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const moduleTopicRows = await db
      .select({
        moduleId: courseModules.id,
        moduleTitle: courseModules.title,
        moduleOrder: courseModules.sortOrder,
        topicId: courseTopics.id,
        topicTitle: courseTopics.title,
        topicFormat: courseTopics.format,
        topicContent: courseTopics.content,
        topicOrder: courseTopics.sortOrder,
      })
      .from(courseModules)
      .leftJoin(courseTopics, eq(courseTopics.moduleId, courseModules.id))
      .where(sql`${courseModules.courseId}::text = ${id}`)
      .orderBy(asc(courseModules.sortOrder), asc(courseTopics.sortOrder))

    const topicIds = moduleTopicRows
      .map((r) => r.topicId)
      .filter((id): id is string => id !== null)

    const videoRows = topicIds.length > 0
      ? await db
          .select({ topicId: courseVideos.topicId, id: courseVideos.id })
          .from(courseVideos)
          .where(inArray(courseVideos.topicId, topicIds))
      : []

    const videoByTopicId = new Map(videoRows.map((v) => [v.topicId, v.id]))

    function parseContent(content: string | null): unknown {
      if (!content) return null
      try {
        return JSON.parse(content)
      } catch {
        return content
      }
    }

    const modulesWithTopics = (() => {
      const map = new Map<string, {
        id: string
        title: string
        order: number
        topics: Array<{
          id: string
          title: string
          type: string
          description: unknown
          order: number
          videoUrl: string | null
          videoId: string | null
        }>
      }>()

      for (const row of moduleTopicRows) {
        if (!map.has(row.moduleId)) {
          map.set(row.moduleId, {
            id: row.moduleId,
            title: row.moduleTitle,
            order: row.moduleOrder,
            topics: [],
          })
        }

        if (row.topicId) {
          const mod = map.get(row.moduleId)!
          mod.topics.push({
            id: row.topicId,
            title: row.topicTitle!,
            type: row.topicFormat === "video" ? "video_and_text" : row.topicFormat!,
            description: parseContent(row.topicContent),
            order: row.topicOrder!,
            videoUrl: videoByTopicId.get(row.topicId) ?? null,
            videoId: videoByTopicId.get(row.topicId) ?? null,
          })
        }
      }

      return [...map.values()]
    })()

    const courseReviews = await db
      .select({
        id: reviews.id,
        body: reviews.body,
        rating: reviews.rating,
        studentName: user.name,
        studentImage: user.image,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.studentId, user.id))
      .where(sql`${reviews.courseId}::text = ${id}`)

    const enrollmentResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(enrollments)
      .where(sql`${enrollments.courseId}::text = ${id}`)
      .then((r) => r[0])

    return NextResponse.json({
      ...course,
      modules: modulesWithTopics,
      reviews: courseReviews,
      enrollmentCount: enrollmentResult?.count ?? 0,
    })
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireInstructorOrAdmin()
    const { id } = await params
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
      description,
      overview,
      level,
      price,
      discountedPrice,
      isFree,
      language,
      status,
      thumbnailUrl,
      modules: modulesData,
    } = parsed.data

    await db.transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.content = description
      if (overview !== undefined) updateData.overview = overview
      if (level !== undefined) updateData.level = level
      if (price !== undefined) updateData.price = isFree ? 0 : price
      if (discountedPrice !== undefined)
        updateData.discountedPrice = isFree ? null : discountedPrice
      if (isFree !== undefined) updateData.isFree = isFree
      if (status !== undefined) updateData.status = status
      if (language !== undefined) updateData.language = language
      if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl

      if (Object.keys(updateData).length > 0) {
        const updated = await tx
          .update(courses)
          .set(updateData)
          .where(eq(courses.id, id))
          .returning()
          .then((r) => r[0])

        if (!updated) throw new Error("Course not found")
      }

      if (modulesData) {
        const existingModuleIds = await tx
          .select({ id: courseModules.id })
          .from(courseModules)
          .where(sql`${courseModules.courseId}::text = ${id}`)
          .then((r) => r.map((m) => m.id))

        const incomingModuleIds = modulesData
          .filter((m) => m.id)
          .map((m) => m.id as string)

        for (const modId of existingModuleIds) {
          if (!incomingModuleIds.includes(modId)) {
            await tx
              .delete(courseTopics)
              .where(eq(courseTopics.moduleId, modId))
            await tx.delete(courseModules).where(eq(courseModules.id, modId))
          }
        }

        for (const mod of modulesData) {
          let moduleId: string

          if (mod.id && existingModuleIds.includes(mod.id)) {
            moduleId = mod.id
            await tx
              .update(courseModules)
              .set({ title: mod.title, sortOrder: mod.order })
              .where(eq(courseModules.id, mod.id))
          } else {
            const [created] = await tx
              .insert(courseModules)
              .values({ courseId: id, title: mod.title, sortOrder: mod.order })
              .returning()
            moduleId = created.id
          }

          const existingTopicIds = await tx
            .select({ id: courseTopics.id })
            .from(courseTopics)
            .where(eq(courseTopics.moduleId, moduleId))
            .then((r) => r.map((t) => t.id))

          const incomingTopicIds = (mod.topics ?? [])
            .filter((t) => t.id)
            .map((t) => t.id as string)

          for (const topicId of existingTopicIds) {
            if (!incomingTopicIds.includes(topicId)) {
              await tx.delete(courseTopics).where(eq(courseTopics.id, topicId))
            }
          }

          for (const topic of mod.topics ?? []) {
            if (topic.id && existingTopicIds.includes(topic.id)) {
              await tx
                .update(courseTopics)
                .set({
                  title: topic.title,
                  format:
                    topic.type === "video_and_text" ? "video" : topic.type,
                  content: topic.description
                    ? JSON.stringify(topic.description)
                    : null,
                  sortOrder: topic.order,
                })
                .where(eq(courseTopics.id, topic.id))
            } else {
              await tx.insert(courseTopics).values({
                moduleId,
                title: topic.title,
                format: topic.type === "video_and_text" ? "video" : topic.type,
                content: topic.description
                  ? JSON.stringify(topic.description)
                  : null,
                sortOrder: topic.order,
              })
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      if (error.message === "Course not found") {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const course = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning()
      .then((r) => r[0])

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === "Unauthorized" ? 401 : 403
      return NextResponse.json({ error: error.message }, { status })
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
