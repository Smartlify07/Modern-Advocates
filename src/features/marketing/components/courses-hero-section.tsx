"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Skeleton } from "@/shared/ui/skeleton"

type Course = {
  id: string
  title: string
  thumbnailUrl: string | null
  tutorName: string | null
  avgRating: number
  reviewCount: number
  price: number
  discountedPrice: number | null
}

function CourseCard({ course }: { course: Course }) {
  const displayPrice = course.discountedPrice ?? course.price
  const originalPrice = course.discountedPrice ? course.price : null

  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex w-full flex-col gap-5 rounded-[24px] border border-[#d9d9d9] bg-white px-2.5 pt-2.5 pb-7.5 transition-colors duration-300 hover:bg-gray-50 sm:max-w-[334px]"
    >
      <div className="relative h-[254px] overflow-hidden rounded-[24px]">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 314px, calc(100vw - 68px)"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-10 px-2.5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl leading-normal font-bold text-ma-text">
            {course.title}
          </h2>
          <p className="text-sm leading-normal font-medium text-[#6b7280]">
            {course.tutorName}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] p-[5px] text-sm leading-normal font-medium text-[#6b7280]">
              <Star
                className="size-5 fill-[#ff9d00] text-[#ff9d00]"
                aria-hidden="true"
              />
              {Number(course.avgRating).toFixed(1)}
            </span>
            <span className="inline-flex items-center rounded-md border border-[#e5e7eb] px-[5px] py-1.5 text-sm leading-normal font-medium text-[#6b7280]">
              {course.reviewCount} ratings
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-2.5 leading-normal font-medium">
            <p className="text-xl text-ma-text">
              $ {displayPrice.toFixed(2)} USD
            </p>
            {originalPrice && (
              <p className="text-base text-[#6b7280] line-through">
                $ {originalPrice.toFixed(2)} USD
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function CoursesHeroSection() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["public-courses"],
    queryFn: () => fetch("/api/courses/featured").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  return (
    <section className="bg-white py-20 pb-20 text-ma-text sm:pt-25 sm:pb-25 lg:pt-18">
      <div className="mx-auto max-w-360 px-4 lg:px-25 2xl:px-50">
        <div className="mx-auto max-w-200 text-center">
          <p className="text-base leading-normal font-medium tracking-[0.1em] text-[#6b7280] uppercase">
            Courses
          </p>

          <h1 className="mt-7.5 font-sans text-[28px]/[100%] leading-[1.16] font-extrabold text-balance text-ma-text sm:text-[60px] sm:leading-[70px] lg:tracking-[-5%]">
            Build the Skills That Keep You Moving Forward
          </h1>

          <p className="mt-5 text-base leading-normal text-ma-text lg:mt-10 lg:text-lg">
            Our AI training sessions are designed for people who are managing
            life&apos;s challenges and still showing up. No tech background
            required.
          </p>
        </div>

        <div className="mt-10 grid justify-items-center gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
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

        <p className="mt-10 text-xl leading-normal font-medium text-ma-text sm:mt-16 lg:mt-14 lg:text-2xl">
          The same AI tools reshaping the workplace are also changing how
          healthcare is accessed and navigated. We teach you both - so that a
          diagnosis or a job change doesn&apos;t leave you behind.
        </p>
      </div>
    </section>
  )
}
