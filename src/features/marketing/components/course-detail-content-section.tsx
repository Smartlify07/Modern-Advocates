import { CourseModule } from "@/features/marketing/components/course-module"
import { TutorCard } from "@/features/marketing/components/tutor-card"
import { ReviewCard } from "@/features/marketing/components/review-card"
import { CourseInformationCard } from "@/features/marketing/components/course-information-card"

type TutorData = {
  name: string | null
  image: string | null
}

type CourseContentData = {
  id: string
  overview: string | null
  content: string | null
  language: string
  level: string
  duration: number | null
  tutor: TutorData
  avgRating: number
  reviewCount: number
  enrollmentCount: number
  modules: { id: string; title: string; sortOrder: number; topics: { id: string; title: string; format: string; content: string | null }[] }[]
  reviews: { id: string; body: string | null; rating: number; studentName: string | null; studentImage: string | null }[]
}

export function CourseDetailContentSection({
  course,
}: {
  course: CourseContentData
}) {
  return (
    <section className="bg-white py-10 text-ma-text lg:py-20">
      <div className="mx-auto flex flex-col-reverse gap-12 px-4 lg:grid lg:max-w-7xl lg:grid-cols-[0.6fr_0.4fr] lg:items-start lg:justify-between lg:px-25 xl:grid-cols-[598px_335px] 2xl:max-w-360 2xl:px-50">
        <div className="flex w-full max-w-[598px] flex-col gap-[30px]">
          <section className="flex flex-col gap-4">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Course overview
            </h2>
            <p className="text-base leading-normal text-ma-text">
              {course.overview ?? course.content ?? "No description available."}
            </p>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Course Module
            </h2>
            <div className="flex flex-col gap-4">
              {course.modules.map((module, index) => (
                <CourseModule
                  key={module.id}
                  title={module.title}
                  topics={module.topics}
                  open={index === 0}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Meet your tutor
            </h2>
            <TutorCard
              tutor={course.tutor}
              enrollmentCount={course.enrollmentCount}
              avgRating={course.avgRating}
              reviewCount={course.reviewCount}
            />
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Student review of this course
            </h2>
            {course.reviews.length > 0 ? (
              course.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="text-base text-[#6b7280]">
                No reviews yet. Be the first to review this course!
              </p>
            )}
          </section>
        </div>

        <CourseInformationCard course={course} />
      </div>
    </section>
  )
}
