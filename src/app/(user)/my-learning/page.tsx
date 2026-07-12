"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  CourseCard,
  type Course,
} from "@/features/courses/components/course-card"
import { cn } from "@/shared/utils"

export default function MyLearningPage() {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery<Course[]>({
    queryKey: ["my-learning"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/enrollments")
        if (!res.ok)
          throw new Error(`Failed to fetch enrollments (${res.status})`)
        return res.json()
      } catch (error) {
        throw error
      }
    },
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <h1 className="mb-10 text-2xl font-bold text-ma-text">My Learning</h1>

        <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-5 sm:max-w-[334px]"
            >
              <Skeleton className="h-[254px] rounded-[24px]" />
              <div className="flex flex-col gap-2 px-2.5">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex flex-col gap-5 px-2.5">
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-ma-text">
          Failed to load your courses
        </h2>
        <p className="max-w-md text-[#6b7280]">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    )
  }

  if (!courses?.length) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-ma-text">No enrollments yet</h2>
        <p className="max-w-md text-[#6b7280]">
          You haven&apos;t enrolled in any courses yet. Browse our catalog and
          start your learning journey today.
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          Browse courses
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-12.5 lg:max-w-7xl lg:px-25 lg:py-19.25 2xl:max-w-360 2xl:px-50">
      <h1 className="mb-10 text-2xl font-bold text-ma-text lg:text-[32px]">
        My Learning
      </h1>

      <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <CourseCard.Root key={course.id} href={`/my-learning/${course.id}`}>
            <CourseCard.Thumbnail
              src={course.thumbnailUrl}
              alt={course.title}
            />
            <CourseCard.Content className={cn("justify-start gap-10")}>
              <div className="flex flex-col gap-2">
                <CourseCard.Title>{course.title}</CourseCard.Title>
                <CourseCard.Tutor name={course.tutorName} />
              </div>

              <div className="flex flex-col gap-5">
                <CourseCard.Rating
                  avg={course.avgRating}
                  count={course.reviewCount}
                />
                <CourseCard.Progress value={course.progress ?? 0} />
              </div>
            </CourseCard.Content>
          </CourseCard.Root>
        ))}
      </div>
    </div>
  )
}
