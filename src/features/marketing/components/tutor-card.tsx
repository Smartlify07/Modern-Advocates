import Image from "next/image"
import { Star, User } from "lucide-react"

type TutorData = {
  name: string | null
  image: string | null
  specialty: string | null
  about: string | null
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
    <article className="flex gap-5 rounded-2xl bg-ma-surface-2 p-4">
      <div className="relative h-[190px] min-w-[106px] shrink-0 overflow-hidden rounded-[10px] sm:w-[190px]">
        <Image
          src={tutor?.image ?? "/placeholder.jpeg"}
          alt={tutor?.name ?? "Tutor"}
          fill
          sizes="190px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-[22px]">
        <div className="flex flex-col gap-1 text-ma-text">
          <h3 className="marketing-header text-base leading-normal font-bold">
            {tutor?.name ?? "Instructor"}
          </h3>
          <p className="text-xs leading-normal sm:text-[15px]">
            {tutor?.specialty ?? "Course Instructor"}
          </p>
        </div>

        <p className="text-xs leading-normal text-ma-text sm:text-[15px]">
          {tutor?.about ?? "Experienced professional with expertise in this field, dedicated to helping students build practical skills and achieve their goals."}
        </p>

        <div className="flex flex-nowrap items-center gap-4 text-[10px] leading-normal font-medium text-nowrap text-muted-foreground sm:text-sm lg:flex-wrap">
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5 sm:size-5" />
            {enrollmentCount ?? 0} students
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-ma-star text-ma-star sm:size-5" />
            {avgRating?.toFixed(1) ?? 0} ({reviewCount} reviews)
          </span>
        </div>
      </div>
    </article>
  )
}
