"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import { apiFetch } from "@/shared/lib/api-fetch"
import { UserAvatar } from "@/shared/ui/user-avatar"
import {
  CourseCard,
  type Course,
} from "@/features/courses/components/course-card"
import { useSession } from "@/shared/hooks/use-session"
import { queryKeys } from "@/shared/lib/query-keys"
import { cn } from "@/shared/utils"
import { Button } from "@/shared/ui/button"
import {
  ErrorState,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateAction,
} from "@/shared/ui/error-state"

export default function UserDashboardPage() {
  const { data: session } = useSession()
  const user = session?.user

  const firstName = user?.name?.split(" ")[0] ?? "User"

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErrorObj,
    refetch,
  } = useQuery<Course[]>({
    queryKey: queryKeys.userCourses,
    queryFn: () => apiFetch<Course[]>("/api/courses/featured"),
  })

  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    error: enrollmentsErrorObj,
    refetch: refetchEnrollments,
  } = useQuery<Course[]>({
    queryKey: queryKeys.userEnrollments,
    queryFn: () => apiFetch<Course[]>("/api/enrollments"),
  })

  const isLoading = coursesLoading || enrollmentsLoading
  const isError = coursesError || enrollmentsError
  const errorObj = coursesErrorObj ?? enrollmentsErrorObj

  const enrollmentMap = useMemo(() => {
    if (!enrollments) return new Map<string, number>()
    return new Map(enrollments.map((e) => [e.id, e.progress ?? 0]))
  }, [enrollments])

  return (
    <div className="marketing-container px-0! py-8! sm:py-19.25!">
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-5 sm:max-w-[300px]"
            >
              <Skeleton className="h-[254px] rounded-card-2" />
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
        <ErrorState>
          <ErrorStateTitle className="text-2xl font-bold text-ma-text">
            Failed to load courses
          </ErrorStateTitle>
          <ErrorStateDescription>
            {errorObj instanceof Error
              ? errorObj.message
              : "Something went wrong"}
          </ErrorStateDescription>
          <ErrorStateAction>
            <Button
              onClick={() => {
                refetch()
                refetchEnrollments()
              }}
            >
              Try Again
            </Button>
          </ErrorStateAction>
        </ErrorState>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => {
            const enrolledProgress = enrollmentMap.get(course.id)
            const isEnrolled = enrolledProgress !== undefined

            return (
              <CourseCard.Root
                key={course.id}
                href={
                  isEnrolled
                    ? `/my-learning/${course.id}`
                    : `/dashboard/course/${course.id}`
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
                    <CourseCard.Tutor name={course.instructorName} />
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
