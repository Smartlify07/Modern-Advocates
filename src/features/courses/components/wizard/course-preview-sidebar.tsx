"use client"

import { ClockIcon, PlayCircle, LayersIcon, Languages } from "lucide-react"

export function CoursePreviewSidebar({
  totalDuration,
  lectureCount,
  levelCapitalized,
  languageDisplay,
}: {
  totalDuration: string
  lectureCount: number
  levelCapitalized: string
  languageDisplay: string
}) {
  const infoItems = [
    { label: "Duration:", value: totalDuration, icon: ClockIcon },
    { label: "Lesson:", value: `${lectureCount} Lessons`, icon: PlayCircle },
    { label: "Level:", value: levelCapitalized || "Not set", icon: LayersIcon },
    { label: "Language:", value: languageDisplay, icon: Languages },
  ]

  return (
    <aside className="w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 pt-4 pb-[25px]">
      <h2 className="text-xl font-extrabold text-ma-text sm:text-2xl">
        Course information
      </h2>
      <div className="mt-6 flex flex-col">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="border-dashed border-[#d9d9d9] py-4 not-last:border-b first:pt-0 first:pb-4 last:pb-0"
          >
            <div className="flex items-center justify-between gap-4 py-0">
              <span className="inline-flex items-center gap-2 text-base font-medium text-ma-text">
                <item.icon className="size-5 shrink-0 text-[#6b7280]" />
                {item.label}
              </span>
              <span className="text-base font-medium whitespace-nowrap text-ma-text">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
