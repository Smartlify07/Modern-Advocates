"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Languages,
  Layers,
  PlayCircle,
  Star,
  User,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/shared/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

type TopicData = {
  id: string
  title: string
  format: string
  content: string | null
}

type ModuleData = {
  id: string
  title: string
  sortOrder: number
  topics: TopicData[]
}

type ReviewData = {
  id: string
  body: string | null
  rating: number
  studentName: string | null
  studentImage: string | null
}

type TutorData = {
  name: string | null
  image: string | null
}

type CourseContentData = {
  overview: string | null
  content: string | null
  language: string
  level: string
  duration: number | null
  tutor: TutorData
  avgRating: number
  reviewCount: number
  enrollmentCount: number
  modules: ModuleData[]
  reviews: ReviewData[]
}

function CourseModule({
  title,
  topics,
  open: defaultOpen = false,
}: {
  title: string
  topics?: TopicData[]
  open?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={`rounded-2xl border border-[#d9d9d9] px-5 pt-[17px] pb-5 transition-colors ${
        open ? "bg-[#f5f5f5]" : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <h3 className="text-sm/[100%] leading-normal font-bold text-ma-text sm:text-base">
          {title}
        </h3>
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[15px] border border-[#d9d9d9] bg-white">
          <ChevronDown
            className={`size-3.5 transition-transform duration-600 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {topics && topics.length > 0 ? (
          <div className="mt-4 text-sm leading-normal text-ma-text sm:text-[15px]">
            <p>Topics:</p>
            <ul className="list-disc pl-5">
              {topics.map((topic) => (
                <li key={topic.id}>{topic.title}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TutorCard({
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
        {/* {tutor.image ? (
          <Image
            src={tutor.image}
            alt={tutor.name ?? "Tutor"}
            fill
            sizes="190px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200 text-4xl font-bold text-gray-400">
            {tutor.name?.[0] ?? "?"}
          </div>
        )} */}
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
            <User className="size-3.5 sm:size-5" aria-hidden="true" />
            {enrollmentCount} students
          </span>
          <span className="inline-flex items-center gap-1">
            <Star
              className="size-3.5 fill-[#ff9d00] text-[#ff9d00] sm:size-5"
              aria-hidden="true"
            />
            {avgRating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>
      </div>
    </article>
  )
}

function ReviewCard({ review }: { review: ReviewData }) {
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

        <div
          className="flex items-center text-[#ff9d00]"
          aria-label={`${review.rating} stars`}
        >
          {Array.from({ length: review.rating }).map((_, index) => (
            <Star key={index} className="size-6 fill-current" />
          ))}
        </div>
      </div>
    </article>
  )
}

function CourseInformationCard({ course }: { course: CourseContentData }) {
  const totalTopics = course.modules.reduce(
    (sum, m) => sum + m.topics.length,
    0
  )
  const durationHours = course.duration
    ? Math.round(course.duration / 60)
    : null
  const levelCapitalized =
    course.level.charAt(0).toUpperCase() + course.level.slice(1)
  const languageDisplay =
    course.language === "en"
      ? "English"
      : course.language === "es"
        ? "Spanish"
        : course.language === "fr"
          ? "French"
          : course.language

  const infoItems = [
    {
      label: "Duration:",
      value: durationHours ? `${durationHours} Hours` : "Self-paced",
      icon: Clock,
    },
    {
      label: "Lesson:",
      value: `${totalTopics} Lessons`,
      icon: PlayCircle,
    },
    {
      label: "Level:",
      value: levelCapitalized,
      icon: Layers,
    },
    {
      label: "Language:",
      value: languageDisplay,
      icon: Languages,
    },
  ]

  return (
    <aside className="w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 pt-4 pr-3.5 pb-[25px] lg:sticky lg:top-8">
      <h2 className="leading/[100%]-normal text-xl font-extrabold text-ma-text sm:text-2xl">
        Course information
      </h2>

      <div className="mt-6 flex flex-col">
        {infoItems.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4 py-0">
              <span className="inline-flex items-center gap-2 text-base leading-normal font-medium text-ma-text">
                <item.icon
                  className="size-5 shrink-0 text-[#6b7280]"
                  aria-hidden="true"
                />
                {item.label}
              </span>
              <span className="text-base leading-normal font-medium whitespace-nowrap text-ma-text">
                {item.value}
              </span>
            </div>

            {index < infoItems.length - 1 ? (
              <div className="my-4 border-t border-dashed border-[#d9d9d9]" />
            ) : (
              <div className="mt-4 border-t border-dashed border-[#d9d9d9]" />
            )}
          </div>
        ))}

        <div className="group relative mt-6">
          <Button asChild className="w-full rounded-[60px]" variant={"outline"}>
            <Link
              href="/signup"
              className="flex h-[53px] w-full items-center justify-center gap-2.5 rounded-[60px] border border-[#e5e7eb] bg-white px-5 py-4 text-base font-semibold text-primary transition-colors duration-300 group-hover:border-transparent group-hover:bg-transparent"
            >
              Enroll Now
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

export function CourseDetailContentSection({
  course,
}: {
  course: CourseContentData
}) {
  return (
    <section className="bg-white py-10 text-ma-text lg:py-20">
      <div className="mx-auto flex flex-col-reverse gap-12 px-4 lg:grid lg:max-w-7xl lg:grid-cols-[598px_335px] lg:items-start lg:justify-between lg:px-25 2xl:max-w-360 2xl:px-50">
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
            <h2 className="/[100%]leading-normal text-xl font-extrabold text-ma-text sm:text-2xl">
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
