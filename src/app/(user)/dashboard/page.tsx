"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/shared/ui/skeleton"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import {
  CourseCard,
  type Course,
} from "@/features/courses/components/course-card"
import { authClient } from "@/infrastructure/auth/client"

export default function UserDashboardPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const firstName = user?.name?.split(" ")[0] ?? "User"
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["user-courses"],
    queryFn: () => fetch("/api/courses/featured").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  return (
    <div className="mx-auto px-4 py-8 lg:max-w-7xl lg:px-25 lg:py-19.25 2xl:max-w-360 2xl:px-50">
      <div className="mb-26.75 flex items-center gap-4">
        <Avatar className="size-12.5 bg-primary text-white">
          <AvatarFallback className="bg-primary text-base text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold text-ma-text">
          Welcome back, {firstName}
        </p>
      </div>

      <div className="mb-12.5">
        <h1 className="text-[32px]/[100%] font-bold text-primary">
          All Courses
        </h1>
      </div>

      <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
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
            ))
          : courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
      </div>

      <p className="mt-17.5 text-xl leading-normal font-medium text-ma-text sm:mt-16 lg:mt-14 lg:text-2xl">
        The same AI tools reshaping the workplace are also changing how
        healthcare is accessed and navigated. We teach you both - so that a
        diagnosis or a job change doesn&apos;t leave you behind.
      </p>
    </div>
  )
}
