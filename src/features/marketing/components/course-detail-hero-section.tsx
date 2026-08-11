import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Users } from "lucide-react"

import { EnrollNowButton } from "@/features/courses/components/enroll-now-button"

type CourseHeroData = {
  id: string
  title: string
  thumbnailUrl: string | null
  instructorName: string | null
  avgRating: number
  reviewCount: number
  price: number
  discountedPrice: number | null
  enrollmentCount: number
}

export function CourseDetailHeroSection({
  course,
  breadcrumbHref = "/courses",
}: {
  course: CourseHeroData
  breadcrumbHref?: string
}) {
  const displayPrice = course.discountedPrice ?? course.price

  return (
    <section className="bg-ma-surface-2 py-10 text-ma-text sm:py-[90px] lg:py-16">
      <div className="marketing-container grid gap-5 py-0! sm:grid-cols-2 sm:py-0">
        <div className="relative min-h-[360px] overflow-hidden rounded-card-2 sm:min-h-[428px]">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={`${course.title} thumbnail`}
              fill
              priority
              sizes="(min-width: 1024px) 510px, calc(100vw - 48px)"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100" />
          )}
        </div>

        <div className="flex flex-col justify-between px-0 py-2 lg:min-h-107 lg:px-2.5 lg:py-0">
          <div className="flex flex-col gap-5">
            <nav
              aria-label="Breadcrumb"
              className="hidden flex-wrap items-center gap-1 text-base leading-normal font-medium lg:flex"
            >
              <Link
                href={breadcrumbHref}
                className="text-muted-foreground transition-colors hover:text-ma-text"
              >
                Course
              </Link>
              <ChevronRight
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <span className="text-ma-text">{course.title}</span>
            </nav>

            <div>
              <h1 className="marketing-header max-w-[510px] text-[28px] leading-normal font-bold text-ma-text lg:text-[40px]">
                {course.title}
              </h1>
              <p className="mt-5 text-lg leading-normal text-ma-text">
                {course.instructorName ?? "Instructor"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-border p-[5px] text-sm leading-normal font-medium text-muted-foreground">
                <Users className="size-5 text-muted-foreground" aria-hidden />
                {course.enrollmentCount} Students Enrolled
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-border p-[5px] text-sm leading-normal font-medium text-muted-foreground">
                <Star
                  className="size-5 fill-ma-star text-ma-star"
                  aria-hidden
                />
                {course.avgRating.toFixed(1)}
              </span>
              <span className="inline-flex items-center rounded-md border border-border px-[5px] py-1.5 text-sm leading-normal font-medium text-muted-foreground">
                {course.reviewCount} ratings
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5 leading-normal font-medium">
              <p className="text-2xl text-ma-text">
                $ {displayPrice.toFixed(2)} USD
              </p>
              {course.discountedPrice && (
                <p className="text-base text-muted-foreground line-through">
                  $ {course.price.toFixed(2)} USD
                </p>
              )}
            </div>

            <div className="mt-3">
              <EnrollNowButton courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
