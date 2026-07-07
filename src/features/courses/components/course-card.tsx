import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

export type Course = {
  id: string
  title: string
  thumbnailUrl: string | null
  tutorName: string | null
  avgRating: number
  reviewCount: number
  price: number
  discountedPrice: number | null
}

export function CourseCard({ course }: { course: Course }) {
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
