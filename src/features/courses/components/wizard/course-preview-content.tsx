"use client"

import Image from "next/image"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { CoursePreviewSidebar } from "@/features/courses/components/wizard/course-preview-sidebar"
import { Users, Star } from "lucide-react"

export function CoursePreviewContent() {
  const mods = useCourseWizardStore((s) => s.modules)
  const level = useCourseWizardStore((s) => s.level)
  const language = useCourseWizardStore((s) => s.language)
  const duration = useCourseWizardStore((s) => s.duration)
  const durationUnit = useCourseWizardStore((s) => s.durationUnit)
  const instructorName = useCourseWizardStore((s) => s.instructorName)
  const instructorSpecialty = useCourseWizardStore((s) => s.instructorSpecialty)
  const aboutInstructor = useCourseWizardStore((s) => s.aboutInstructor)
  const instructorPhotoPreview = useCourseWizardStore(
    (s) => s.instructorPhotoPreview
  )
  const overview = useCourseWizardStore((s) => s.overview)

  const topicCount = mods.reduce((acc, m) => acc + m.topics.length, 0)
  const overviewText = overview
    ? (overview.content ?? [])
        .map((n: any) => n.content?.map((c: any) => c.text).join(" "))
        .join(" ")
    : ""
  const levelCapitalized = level
    ? level.charAt(0).toUpperCase() + level.slice(1)
    : ""
  const languageDisplay = language || "English"
  const totalDuration = duration ? `${duration} ${durationUnit}` : "No duration"

  return (
    <section className="bg-white py-10 text-ma-text lg:py-12">
      <div className="mx-auto flex w-full flex-col-reverse gap-10 lg:grid lg:grid-cols-[0.6fr_0.5fr] lg:items-start lg:gap-30">
        <div className="flex w-full max-w-[598px] flex-col gap-[30px]">
          {/* Overview */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold text-ma-text sm:text-2xl">
              Course overview
            </h2>
            <p className="text-base text-ma-text">
              {overviewText || "No description available."}
            </p>
          </section>

          {/* Modules */}
          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-ma-text sm:text-2xl">
              Course Module
            </h2>
            <div className="flex flex-col gap-4">
              {mods.length > 0 ? (
                mods.map((mod, i) => (
                  <div
                    key={mod.id}
                    className={`rounded-2xl border border-ma-border-light px-5 pt-[17px] pb-5 ${i === 0 ? "bg-ma-surface-2" : "bg-white"}`}
                  >
                    <h3 className="text-sm font-bold text-ma-text sm:text-base">
                      {mod.title || "Untitled Module"}
                    </h3>
                    {mod.topics.length > 0 && (
                      <div className="mt-4 text-sm text-ma-text sm:text-[15px]">
                        <p>Topics:</p>
                        <ul className="list-disc pl-5">
                          {mod.topics.map((top) => (
                            <li key={top.id}>
                              {top.title || "Untitled Topic"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No modules added yet.</p>
              )}
            </div>
          </section>

          {/* Tutor */}
          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-ma-text sm:text-2xl">
              Meet your tutor
            </h2>
            <article className="flex gap-5 rounded-2xl bg-ma-surface-2 p-4">
              <div className="relative flex h-[120px] min-w-[106px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-slate-200 sm:h-[190px] sm:w-[190px]">
                {instructorPhotoPreview ? (
                  <Image
                    src={instructorPhotoPreview}
                    alt="Instructor"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Users className="size-10 text-slate-400" />
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 text-ma-text">
                  <h3 className="text-base font-bold">
                    {instructorName || "Instructor"}
                  </h3>
                  <p className="text-xs sm:text-[15px]">
                    {instructorSpecialty || "Course Instructor"}
                  </p>
                </div>
                <p className="text-xs text-ma-text sm:text-[15px]">
                  {aboutInstructor ||
                    "Experienced professional with expertise in this field."}
                </p>
                <div className="my-auto flex flex-nowrap items-center gap-4 text-[10px] font-medium text-muted-foreground sm:text-sm">
                  <span className="inline-flex items-center gap-1 text-nowrap">
                    <Users className="size-3.5 sm:size-5" />0 students
                  </span>
                  <span className="my-auto inline-flex flex-nowrap items-center gap-1 text-nowrap">
                    <Star className="size-3.5 fill-ma-star text-ma-star sm:size-5" />
                    0.0 (0 reviews)
                  </span>
                </div>
              </div>
            </article>
          </section>
        </div>

        <CoursePreviewSidebar
          totalDuration={totalDuration}
          lectureCount={topicCount}
          levelCapitalized={levelCapitalized}
          languageDisplay={languageDisplay}
        />
      </div>
    </section>
  )
}
