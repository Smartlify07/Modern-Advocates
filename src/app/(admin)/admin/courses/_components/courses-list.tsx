"use client"

import { Skeleton } from "@/shared/ui/skeleton"
import { Button } from "@/shared/ui/button"
import CourseCardItem from "./course-card-item"
import type { Course } from "./types"
import {
  ErrorState,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateAction,
} from "@/shared/ui/error-state"

export default function CoursesList({
  courses,
  isLoading,
  isError,
  error,
  refetch,
}: {
  courses: Course[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}) {
  if (isLoading)
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex w-full flex-col gap-5 rounded-card-2 border border-ma-border-light bg-white px-2.5 pt-2.5 pb-5"
          >
            <Skeleton className="h-[254px] rounded-card-2" />
            <div className="flex flex-col gap-2 px-2.5">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center justify-between px-2.5">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="size-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )

  if (isError)
    return (
      <ErrorState className="rounded-xl bg-muted/50 py-32">
        <ErrorStateTitle>Failed to load courses</ErrorStateTitle>
        <ErrorStateDescription>
          {error instanceof Error ? error.message : "Something went wrong"}
        </ErrorStateDescription>
        <ErrorStateAction>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </ErrorStateAction>
      </ErrorState>
    )

  if (courses.length === 0)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 py-32">
        <h3 className="text-lg font-semibold">No Course Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start creating a course by clicking on the &ldquo;Create New
          Courses&rdquo; button.
        </p>
      </div>
    )

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCardItem key={course.id} course={course} />
      ))}
    </div>
  )
}
