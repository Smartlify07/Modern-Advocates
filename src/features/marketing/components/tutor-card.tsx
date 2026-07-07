import Image from "next/image"
import { Star, User } from "lucide-react"

type TutorData = {
  name: string | null
  image: string | null
}

export function TutorCard({
  tutor,
  enrollmentCount,
  avgRating,
  reviewCount,
}: {
  tutor: TutorData
  enrollmentCount: number
  avgRating: number
  reviewCount: number
}) {
  return (
    <article className="flex gap-5 rounded-2xl bg-[#f5f5f5] p-4">
      <div className="relative h-[190px] min-w-[106px] shrink-0 overflow-hidden rounded-[10px] sm:w-[190px]">
        <Image
          src={"/figma-courses/tutor-maxwell.png"}
          alt={tutor.name ?? "Tutor"}
          fill
          sizes="190px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-[22px]">
        <div className="flex flex-col gap-1 text-ma-text">
          <h3 className="text-base leading-normal font-bold">
            {tutor.name ?? "Instructor"}
          </h3>
          <p className="text-xs leading-normal sm:text-[15px]">
            Course Instructor
          </p>
        </div>

        <p className="text-xs leading-normal text-ma-text sm:text-[15px]">
          Experienced professional with expertise in this field, dedicated to
          helping students build practical skills and achieve their goals.
        </p>

        <div className="flex flex-nowrap items-center gap-4 text-[10px] leading-normal font-medium text-nowrap text-[#6b7280] sm:text-sm lg:flex-wrap">
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5 sm:size-5" />
            {enrollmentCount} students
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-[#ff9d00] text-[#ff9d00] sm:size-5" />
            {avgRating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>
      </div>
    </article>
  )
}
