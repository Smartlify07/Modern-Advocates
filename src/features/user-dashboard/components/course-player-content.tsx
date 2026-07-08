"use client"

import { useState } from "react"
import { VideoPlayer } from "@/features/videos/components/video-player"
import { TutorCard } from "@/features/marketing/components/tutor-card"
import { ReviewCard } from "@/features/marketing/components/review-card"
import { CourseInformationCard } from "@/features/marketing/components/course-information-card"

type Topic = {
  id: string
  title: string
  format: string
  content: string | null
}
type Module = { id: string; title: string; sortOrder: number; topics: Topic[] }
type Review = {
  id: string
  body: string | null
  rating: number
  studentName: string | null
  studentImage: string | null
}
type Tutor = { name: string | null; image: string | null }

type CourseData = {
  id: string
  title: string
  overview: string | null
  thumbnailUrl: string | null
  duration: number | null
  level: string
  language: string
  avgRating: number
  reviewCount: number
  enrollmentCount: number
  tutor: Tutor
  modules: Module[]
  reviews: Review[]
}

export function CoursePlayerContent({ course }: { course: CourseData }) {
  const [tab, setTab] = useState<"overview" | "reviews">("overview")

  return (
    <div className="flex flex-col gap-6">
      <VideoPlayer
        playbackUrl={null}
        thumbnailUrl={course.thumbnailUrl}
        videoId={course.id}
      />

      <div className="mx-3 flex gap-6 border-b border-[#e5e7eb]">
        <button
          onClick={() => setTab("overview")}
          className={`pb-2 text-sm font-medium ${tab === "overview" ? "border-b-2 border-ma-text text-ma-text" : "text-[#6b7280]"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`pb-2 text-sm font-medium ${tab === "reviews" ? "border-b-2 border-ma-text text-ma-text" : "text-[#6b7280]"}`}
        >
          Reviews
        </button>
      </div>

      <div className="mt-10 ml-[calc(max(100px,(100vw-1080px)/2))] flex min-h-125 w-[600px] flex-col gap-7.5 px-4 lg:px-0">
        {tab === "overview" ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {course.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-primary">
                {course.overview ?? "No description available."}
              </p>
            </div>

            <CourseInformationCard course={course} />

            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold text-ma-text">
                Meet your tutor
              </h2>
              <TutorCard
                tutor={course.tutor}
                enrollmentCount={course.enrollmentCount}
                avgRating={course.avgRating}
                reviewCount={course.reviewCount}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-ma-text">Student Reviews</h2>
            {course.reviews.length > 0 ? (
              course.reviews.map((r) => <ReviewCard key={r.id} review={r} />)
            ) : (
              <p className="text-base text-[#6b7280]">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
