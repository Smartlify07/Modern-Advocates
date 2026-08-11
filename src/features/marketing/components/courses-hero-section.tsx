"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  CourseCard,
  type Course,
} from "@/features/courses/components/course-card"

export function CoursesHeroSection() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: queryKeys.publicCourses,
    queryFn: () => apiFetch<Course[]>(`/api/courses/featured`),
  })

  return (
    <section className="bg-white text-ma-text">
      <div className="marketing-container">
        <div className="mx-auto max-w-200 text-center">
          <p className="text-base leading-normal font-medium tracking-[0.1em] text-muted-foreground uppercase">
            Trainings
          </p>

          <h1 className="marketing-header marketing-headline mt-7.5">
            Build the Skills That Keep You Moving Forward
          </h1>

          <p className="mt-5 text-base leading-normal text-ma-text sm:mt-10 sm:text-xl">
            Our AI training sessions are designed for people who are managing
            life&apos;s challenges and still showing up. No tech background
            required.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full flex-col gap-5 sm:max-w-[400px]"
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
              ))
            : courses?.map((course) => (
                <CourseCard.Root key={course.id} href={`/courses/${course.id}`}>
                  <CourseCard.Thumbnail
                    src={course.thumbnailUrl}
                    alt={course.title}
                  />
                  <CourseCard.Content className="gap-10">
                    <div className="flex flex-col gap-2">
                      <CourseCard.Title>{course.title}</CourseCard.Title>
                      <CourseCard.Tutor name={course.instructorName} />
                    </div>
                    <div className="mt-auto flex flex-col gap-5">
                      <CourseCard.Rating
                        avg={course.avgRating}
                        count={course.reviewCount}
                      />
                      <CourseCard.Price
                        price={course.price}
                        discountedPrice={course.discountedPrice}
                      />
                    </div>
                  </CourseCard.Content>
                </CourseCard.Root>
              ))}
        </div>

        <p className="mt-10 text-xl leading-normal font-medium text-ma-text sm:mt-16 lg:mt-14 lg:text-2xl">
          The same AI tools reshaping the workplace are also changing how
          healthcare is accessed and navigated. We teach you both - so that a
          diagnosis or a job change doesn&apos;t leave you behind.
        </p>
      </div>
    </section>
  )
}
