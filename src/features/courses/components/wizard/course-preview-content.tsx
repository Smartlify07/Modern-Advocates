"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { CoursePreviewSidebar } from "@/features/courses/components/wizard/course-preview-sidebar"
import { Users, Star } from "lucide-react"

export function CoursePreviewContent() {
  const sections = useCourseWizardStore((s) => s.sections)
  const level = useCourseWizardStore((s) => s.level)
  const language = useCourseWizardStore((s) => s.language)
  const duration = useCourseWizardStore((s) => s.duration)
  const durationUnit = useCourseWizardStore((s) => s.durationUnit)
  const instructorName = useCourseWizardStore((s) => s.instructorName)
  const instructorSpecialty = useCourseWizardStore((s) => s.instructorSpecialty)
  const aboutInstructor = useCourseWizardStore((s) => s.aboutInstructor)
  const overview = useCourseWizardStore((s) => s.overview)

  const lectureCount = sections.reduce((acc, s) => acc + s.lectures.length, 0)
  const overviewText = overview
    ? (overview.content ?? [])
        .map((n: any) => n.content?.map((c: any) => c.text).join(" "))
        .join(" ")
    : ""
  const levelCapitalized = level
    ? level.charAt(0).toUpperCase() + level.slice(1)
    : ""
  const languageDisplay = language || "English"
  const totalDuration = duration ? `${duration} ${durationUnit}` : "Self-paced"

  return (
    <section className="bg-white py-10 text-ma-text lg:py-12">
      <div className="mx-auto flex flex-col-reverse gap-10 lg:grid lg:grid-cols-[0.6fr_0.4fr] lg:items-start lg:gap-20">
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
              {sections.length > 0 ? (
                sections.map((sec, i) => (
                  <div
                    key={sec.id}
                    className={`rounded-2xl border border-[#d9d9d9] px-5 pt-[17px] pb-5 ${i === 0 ? "bg-[#f5f5f5]" : "bg-white"}`}
                  >
                    <h3 className="text-sm font-bold text-ma-text sm:text-base">
                      {sec.title || "Untitled Section"}
                    </h3>
                    {sec.lectures.length > 0 && (
                      <div className="mt-4 text-sm text-ma-text sm:text-[15px]">
                        <p>Topics:</p>
                        <ul className="list-disc pl-5">
                          {sec.lectures.map((lec) => (
                            <li key={lec.id}>
                              {lec.title || "Untitled Lecture"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6b7280]">No modules added yet.</p>
              )}
            </div>
          </section>

          {/* Tutor */}
          <section className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-ma-text sm:text-2xl">
              Meet your tutor
            </h2>
            <article className="flex gap-5 rounded-2xl bg-[#f5f5f5] p-4">
              <div className="flex h-[120px] min-w-[106px] items-center justify-center overflow-hidden rounded-[10px] bg-slate-200 sm:h-[190px] sm:w-[190px]">
                <Users className="size-10 text-slate-400" />
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
                <div className="my-auto flex flex-nowrap items-center gap-4 text-[10px] font-medium text-[#6b7280] sm:text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5 sm:size-5" />0 students
                  </span>
                  <span className="my-auto inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-[#ff9d00] text-[#ff9d00] sm:size-5" />
                    0.0 (0 reviews)
                  </span>
                </div>
              </div>
            </article>
          </section>
        </div>

        <CoursePreviewSidebar
          totalDuration={totalDuration}
          lectureCount={lectureCount}
          levelCapitalized={levelCapitalized}
          languageDisplay={languageDisplay}
        />
      </div>
    </section>
  )
}
