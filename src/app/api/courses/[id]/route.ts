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
  requireManagerOrAdmin,
} from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { updateCourseSchema } from "@/features/courses/schemas"
import { isValidUuid } from "@/shared/utils"
import * as Sentry from "@sentry/nextjs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

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
        durationUnit: courses.durationUnit,
        instructorName: courses.instructorName,
        instructorSpecialty: courses.instructorSpecialty,
        aboutInstructor: courses.aboutInstructor,
        status: courses.status,
        tutorId: courses.tutorId,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructorImage: courses.instructorImage,
      })
      .from(courses)
      .where(eq(courses.id, id))
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
      .where(eq(courseModules.courseId, id))
      .orderBy(asc(courseModules.sortOrder), asc(courseTopics.sortOrder))

    const topicIds = moduleTopicRows
      .map((r) => r.topicId)
      .filter((id): id is string => id !== null)

    const videoRows =
      topicIds.length > 0
        ? await db
            .select({
              topicId: courseVideos.topicId,
              id: courseVideos.id,
              title: courseVideos.title,
              playbackUrl: courseVideos.playbackUrl,
              duration: courseVideos.duration,
            })
            .from(courseVideos)
            .where(inArray(courseVideos.topicId, topicIds))
        : []

    const videoByTopicId = new Map(
      videoRows.map((v) => [v.topicId, { id: v.id, title: v.title, playbackUrl: v.playbackUrl, duration: v.duration }]),
    )

    function parseContent(content: string | null): unknown {
      if (!content) return null
      try {
        return JSON.parse(content)
      } catch {
        return content
      }
    }

    const modulesWithTopics = (() => {
      const map = new Map<
        string,
        {
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
            videoTitle: string | null
            videoDuration: number | null
          }>
        }
      >()

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
            type:
              row.topicFormat === "video" ? "video_and_text" : row.topicFormat!,
            description: parseContent(row.topicContent),
            order: row.topicOrder!,
            videoUrl: videoByTopicId.get(row.topicId)?.playbackUrl ?? null,
            videoId: videoByTopicId.get(row.topicId)?.id ?? null,
            videoTitle: videoByTopicId.get(row.topicId)?.title ?? null,
            videoDuration: videoByTopicId.get(row.topicId)?.duration ?? null,
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
      .where(eq(reviews.courseId, id))

    const enrollmentResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(enrollments)
      .where(eq(enrollments.courseId, id))
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

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    const body = await request.json()
    const parsed = updateCourseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      title,
      description,
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
      const existing = await db
        .select({ title: courses.title, level: courses.level })
        .from(courses)
        .where(eq(courses.id, id))
        .then((r) => r[0])

      const effectiveTitle = title ?? existing?.title
      const effectiveLevel = level ?? existing?.level

      if (!effectiveTitle) return NextResponse.json({ error: "Title is required to publish" }, { status: 400 })
      if (!effectiveLevel) return NextResponse.json({ error: "Level is required to publish" }, { status: 400 })
    }

    const resultModules = await db.transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.content = description
      if (overview !== undefined) updateData.overview = overview
      if (level !== undefined) updateData.level = level
      if (duration !== undefined) updateData.duration = duration
      if (durationUnit !== undefined) updateData.durationUnit = durationUnit
      if (instructorName !== undefined)
        updateData.instructorName = instructorName
      if (instructorSpecialty !== undefined)
        updateData.instructorSpecialty = instructorSpecialty
      if (aboutInstructor !== undefined)
        updateData.aboutInstructor = aboutInstructor
      if (instructorImage !== undefined)
        updateData.instructorImage = instructorImage
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

      const resultModules: Array<{
        id: string
        clientId: string
        title: string
        sortOrder: number
        topics: Array<{ id: string; clientId: string; title: string; sortOrder: number }>
      }> = []

      if (modulesData) {
        const existingModuleIds = await tx
          .select({ id: courseModules.id })
          .from(courseModules)
          .where(eq(courseModules.courseId, id))
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
          let moduleId: string | null = null
          const clientModuleId = mod.id ?? ""

          if (mod.id && existingModuleIds.includes(mod.id)) {
            moduleId = mod.id
            const updateFields: Record<string, unknown> = {}
            if (mod.title !== undefined) updateFields.title = mod.title
            if (mod.order !== undefined) updateFields.sortOrder = mod.order
            if (Object.keys(updateFields).length > 0) {
              await tx
                .update(courseModules)
                .set(updateFields)
                .where(eq(courseModules.id, mod.id))
            }
          } else if (mod.title) {
            const [created] = await tx
              .insert(courseModules)
              .values({
                courseId: id,
                title: mod.title,
                sortOrder: mod.order ?? 0,
              })
              .returning()
            moduleId = created.id
          }

          if (!moduleId) continue

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

          const resultTopics: Array<{ id: string; clientId: string; title: string; sortOrder: number }> = []

          for (const topic of mod.topics ?? []) {
            if (topic.id && existingTopicIds.includes(topic.id)) {
              const updateFields: Record<string, unknown> = {}
              if (topic.title !== undefined) updateFields.title = topic.title
              if (topic.type !== undefined)
                updateFields.format =
                  topic.type === "video_and_text" ? "video" : topic.type
              if (topic.description !== undefined)
                updateFields.content = topic.description
                  ? JSON.stringify(topic.description)
                  : null
              if (topic.order !== undefined)
                updateFields.sortOrder = topic.order
              if (Object.keys(updateFields).length > 0) {
                await tx
                  .update(courseTopics)
                  .set(updateFields)
                  .where(eq(courseTopics.id, topic.id))
              }

              if (topic.videoTitle !== undefined && topic.videoTitle !== null) {
                await tx
                  .update(courseVideos)
                  .set({ title: topic.videoTitle })
                  .where(eq(courseVideos.topicId, topic.id))
              }

              resultTopics.push({
                id: topic.id,
                clientId: topic.id,
                title: topic.title ?? "",
                sortOrder: topic.order ?? 0,
              })
            } else if (topic.title) {
              const [created] = await tx
                .insert(courseTopics)
                .values({
                  moduleId,
                  title: topic.title,
                  format:
                    topic.type === "video_and_text" ? "video" : (topic.type ?? "text"),
                  content: topic.description
                    ? JSON.stringify(topic.description)
                    : null,
                  sortOrder: topic.order ?? 0,
                })
                .returning()
              resultTopics.push({
                id: created.id,
                clientId: topic.id ?? "",
                title: topic.title,
                sortOrder: topic.order ?? 0,
              })
            }
          }

          resultModules.push({
            id: moduleId,
            clientId: clientModuleId,
            title: mod.title ?? "",
            sortOrder: mod.order ?? 0,
            topics: resultTopics,
          })
        }
      }

      return resultModules
    })

    return NextResponse.json({ id, modules: resultModules })
  } catch (error) {
    console.log(error)
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (error instanceof Error && error.message === "Course not found") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
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
    await requireManagerOrAdmin()
    const { id } = await params

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const [enrollmentResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(enrollments)
      .where(eq(enrollments.courseId, id))

    if (enrollmentResult.count > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete this course because ${enrollmentResult.count} student${enrollmentResult.count !== 1 ? "s have" : " has"} already enrolled.`,
        },
        { status: 409 }
      )
    }

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
    console.error(error)
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
