import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

type ReviewData = {
  id: string
  body: string | null
  rating: number
  studentName: string | null
  studentImage: string | null
}

export function ReviewCard({ review }: { review: ReviewData }) {
  return (
    <article className="flex flex-col gap-[22px] rounded-2xl border border-[#d9d9d9] p-5">
      <p className="text-[15px] leading-normal text-ma-text">
        {review.body ?? "No review text provided."}
      </p>

      <div className="flex gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 items-start gap-2.5">
          <Avatar className="size-12.5">
            <AvatarImage src={review.studentImage!} alt="@shadcn" />
            <AvatarFallback>{review.studentName?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 text-ma-text">
            <h3 className="text-base/[100%] leading-normal font-bold text-nowrap">
              {review.studentName ?? "Student"}
            </h3>
            <p className="text-[15px]/[100%] font-normal text-primary">
              Medical Doctor
            </p>
          </div>
        </div>

        <div className="flex items-center text-[#ff9d00]" aria-label={`${review.rating} stars`}>
          {Array.from({ length: review.rating }).map((_, index) => (
            <Star key={index} className="size-6 fill-current" />
          ))}
        </div>
      </div>
    </article>
  )
}
