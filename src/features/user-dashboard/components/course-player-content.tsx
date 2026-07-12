"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
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

  const { data: courseData } = useQuery<CourseData>({
    queryKey: ["course", course.id],
    queryFn: async () => {
      const r = await fetch(`/api/courses/${course.id}`)
      const json = await r.json()
      return {
        id: json.id,
        title: json.title,
        overview: json.overview,
        thumbnailUrl: json.thumbnailUrl,
        language: json.language,
        level: json.level,
        duration: json.duration ? Number(json.duration) : null,
        avgRating: Number(json.avgRating ?? 0),
        reviewCount: Number(json.reviewCount ?? 0),
        enrollmentCount: Number(json.enrollmentCount ?? 0),
        tutor: { name: json.tutorName, image: json.tutorImage },
        modules: (json.modules ?? []).map((m: any) => ({
          id: m.id,
          title: m.title,
          sortOrder: m.order ?? 0,
          topics: (m.topics ?? []).map((t: any) => ({
            id: t.id,
            title: t.title,
            format: t.type === "video_and_text" ? "video" : (t.type ?? "video"),
            content: typeof t.description === "string" ? t.description : t.description ? JSON.stringify(t.description) : null,
          })),
        })),
        reviews: (json.reviews ?? []).map((r: any) => ({
          id: r.id,
          body: r.body,
          rating: r.rating,
          studentName: r.studentName,
          studentImage: r.studentImage,
        })),
      }
    },
    initialData: course,
  })

  return (
    <div className="flex flex-col gap-6">
      <VideoPlayer
        playbackUrl={null}
        thumbnailUrl={courseData.thumbnailUrl}
        videoId={courseData.id}
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

      <div className="mt-10 flex min-h-125 flex-col gap-7.5 px-4 lg:ml-[calc(max(100px,(100vw-1080px)/2))] lg:w-[600px] lg:px-0">
        {tab === "overview" ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {courseData.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-primary">
                {courseData.overview ?? "No description available."}
              </p>
            </div>

            <CourseInformationCard course={courseData} />

            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold text-ma-text">
                Meet your tutor
              </h2>
              <TutorCard
                tutor={courseData.tutor}
                enrollmentCount={courseData.enrollmentCount}
                avgRating={courseData.avgRating}
                reviewCount={courseData.reviewCount}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-ma-text">Student Reviews</h2>
            {courseData.reviews.length > 0 ? (
              courseData.reviews.map((r) => <ReviewCard key={r.id} review={r} />)
            ) : (
              <p className="text-base text-[#6b7280]">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
