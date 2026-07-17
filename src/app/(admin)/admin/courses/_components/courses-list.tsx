"use client"

import CourseCardItem from "./course-card-item"
import type { Course } from "./types"

export default function CoursesList({
  courses,
  isLoading,
}: {
  courses: Course[]
  isLoading: boolean
}) {
  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50 py-32">
        <p className="text-muted-foreground">Loading...</p>
      </div>
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
