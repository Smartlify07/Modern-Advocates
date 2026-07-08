"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import { CourseCard, type Course } from "@/features/courses/components/course-card"

export default function MyLearningPage() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["my-learning"],
    queryFn: () => fetch("/api/courses/featured").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
      <h1 className="mb-10 text-2xl font-bold text-ma-text">My Learning</h1>

      <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex w-full flex-col gap-5 sm:max-w-[334px]">
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
            ))
          : courses?.map((course) => (
              <CourseCard key={course.id} course={course} href={`/my-learning/${course.id}`} />
            ))}
      </div>
    </div>
  )
}
