"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import { UserAvatar } from "@/shared/ui/user-avatar"
import {
  CourseCard,
  type Course,
} from "@/features/courses/components/course-card"
import { authClient } from "@/infrastructure/auth/client"
import { cn } from "@/shared/utils"

export default function UserDashboardPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const firstName = user?.name?.split(" ")[0] ?? "User"

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErrorObj,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ["user-courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses/featured")
      if (!res.ok) throw new Error("Failed to fetch courses")
      return res.json()
    },
    refetchOnWindowFocus: false,
  })

  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    error: enrollmentsErrorObj,
    refetch: refetchEnrollments,
  } = useQuery<Course[]>({
    queryKey: ["user-enrollments"],
    queryFn: async () => {
      const res = await fetch("/api/enrollments")
      if (!res.ok) throw new Error("Failed to fetch enrollments")
      return res.json()
    },
    refetchOnWindowFocus: false,
  })

  const isLoading = coursesLoading || enrollmentsLoading
  const isError = coursesError || enrollmentsError
  const errorObj = coursesErrorObj ?? enrollmentsErrorObj

  const enrollmentMap = useMemo(() => {
    if (!enrollments) return new Map<string, number>()
    return new Map(enrollments.map((e) => [e.id, e.progress ?? 0]))
  }, [enrollments])

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 lg:py-19.25 2xl:max-w-360 2xl:px-50">
      <div className="mb-[70px] flex items-center gap-4 lg:mb-26.75">
        <UserAvatar user={user} className="size-[50px] lg:size-12.5" />
        <p className="text-xl font-bold text-ma-text lg:text-2xl">
          Welcome back, {firstName}
        </p>
      </div>

      <div className="mb-10 lg:mb-12.5">
        <h1 className="text-[28px]/[100%] font-bold text-primary lg:text-[32px]/[100%]">
          All Courses
        </h1>
      </div>

      {isLoading ? (
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
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-7 w-16 rounded-md" />
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-ma-text">
            Failed to load courses
          </h2>
          <p className="max-w-md text-muted-foreground">
            {errorObj instanceof Error
              ? errorObj.message
              : "Something went wrong"}
          </p>
          <button
            onClick={() => {
              refetch()
              refetchEnrollments()
            }}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => {
            const enrolledProgress = enrollmentMap.get(course.id)
            const isEnrolled = enrolledProgress !== undefined

            return (
              <CourseCard.Root
                key={course.id}
                href={
                  isEnrolled
                    ? `/my-learning/${course.id}`
                    : `/courses/${course.id}`
                }
              >
                <CourseCard.Thumbnail
                  src={course.thumbnailUrl}
                  alt={course.title}
                />
                <CourseCard.Content
                  className={cn(
                    "justify-start",
                    isEnrolled ? "gap-3.5" : "gap-10"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <CourseCard.Title>{course.title}</CourseCard.Title>
                    <CourseCard.Tutor name={course.tutorName} />
                  </div>
                  <div className="mt-auto flex flex-col gap-5">
                    <CourseCard.Rating
                      avg={course.avgRating}
                      count={course.reviewCount}
                    />
                    {isEnrolled ? (
                      <CourseCard.ContinueButton />
                    ) : (
                      <CourseCard.Price
                        price={course.price}
                        discountedPrice={course.discountedPrice}
                      />
                    )}
                  </div>
                </CourseCard.Content>
              </CourseCard.Root>
            )
          })}
        </div>
      )}

      <p className="mt-17.5 text-xl leading-normal font-medium text-ma-text sm:mt-16 lg:mt-14 lg:text-2xl">
        The same AI tools reshaping the workplace are also changing how
        healthcare is accessed and navigated. We teach you both - so that a
        diagnosis or a job change doesn&apos;t leave you behind.
      </p>
    </div>
  )
}
