import { Clock, Languages, Layers, PlayCircle } from "lucide-react"

import { EnrollNowButton } from "@/features/courses/components/enroll-now-button"
import {
  minutesToDuration,
  type DurationUnit,
} from "@/features/courses/lib/duration"

type CourseContentData = {
  id: string
  duration: number | null
  durationUnit: string | null
  level: string
  language: string
  modules: { topics: unknown[] }[]
}

export function CourseInformationCard({
  course,
}: {
  course: CourseContentData
}) {
  const totalTopics = (course.modules ?? []).reduce(
    (sum, m) => sum + m.topics.length,
    0
  )

  console.log(course.durationUnit)
  const displayDuration =
    course.duration && course.durationUnit
      ? minutesToDuration(course.duration, course.durationUnit as DurationUnit)
      : null
  const levelCapitalized = course?.level
    ? course?.level.charAt(0).toUpperCase() + course.level.slice(1)
    : ""
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
      value: displayDuration
        ? `${Math.round(displayDuration.value)} ${displayDuration.unit}`
        : "No duration",
      icon: Clock,
    },
    {
      label: "Lesson:",
      value: `${totalTopics} Lessons`,
      icon: PlayCircle,
    },
    { label: "Level:", value: levelCapitalized, icon: Layers },
    { label: "Language:", value: languageDisplay, icon: Languages },
  ]

  return (
    <aside className="w-full rounded-2xl border border-ma-border-light bg-white px-4 pt-4 pr-3.5 pb-[25px] lg:top-8">
      <h2 className="leading/[100%]-normal text-xl font-extrabold text-ma-text sm:text-2xl">
        Course information
      </h2>

      <div className="mt-6 flex flex-col">
        {infoItems.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4 py-0">
              <span className="inline-flex items-center gap-2 text-base leading-normal font-medium text-ma-text">
                <item.icon className="size-5 shrink-0 text-muted-foreground" />
                {item.label}
              </span>
              <span className="text-base leading-normal font-medium whitespace-nowrap text-ma-text">
                {item.value}
              </span>
            </div>

            <div
              className={
                index < infoItems.length - 1
                  ? "my-4 border-t border-dashed border-ma-border-light"
                  : "mt-4 border-t border-dashed border-ma-border-light"
              }
            />
          </div>
        ))}

        <div className="mt-6">
          <EnrollNowButton courseId={course.id} variant="outline" />
        </div>
      </div>
    </aside>
  )
}
