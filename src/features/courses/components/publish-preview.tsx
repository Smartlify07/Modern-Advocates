"use client"

import { useState } from "react"
import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"
import { ChevronDown, Clock, Languages, Layers, PlayCircle, TagIcon } from "lucide-react"

function ModuleAccordion({
  title,
  topics,
  open: defaultOpen = false,
}: {
  title: string
  topics: { id: string; title: string }[]
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
          {title || "Untitled Module"}
        </h3>
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[15px] border border-[#d9d9d9] bg-white">
          <ChevronDown
            className={`size-3.5 transition-transform duration-600 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {topics.length > 0 ? (
          <div className="mt-4 text-sm leading-normal text-ma-text sm:text-[15px]">
            <p>Topics:</p>
            <ul className="list-disc pl-5">
              {topics.map((topic) => (
                <li key={topic.id}>{topic.title || "Untitled Topic"}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 text-sm text-[#6b7280]">No topics yet</div>
        )}
      </div>
    </div>
  )
}

export function PublishPreview() {
  const title = useCourseFormStore((s) => s.title)
  const categoryName = useCourseFormStore((s) => s.categoryName)
  const description = useCourseFormStore((s) => s.description)
  const level = useCourseFormStore((s) => s.level)
  const modules = useCourseFormStore((s) => s.modules)
  const price = useCourseFormStore((s) => s.price)
  const discount = useCourseFormStore((s) => s.discount)
  const isFree = useCourseFormStore((s) => s.isFree)
  const thumbnailPreview = useCourseFormStore((s) => s.thumbnailPreview)

  const topicCount = modules.reduce((acc, m) => acc + m.topics.length, 0)
  const numericPrice = isFree ? 0 : parseFloat(price) || 0
  const salePrice = numericPrice * (1 - discount / 100)
  const levelCapitalized = level
    ? level.charAt(0).toUpperCase() + level.slice(1)
    : "Not set"

  const infoItems = [
    { label: "Duration:", value: "Self-paced", icon: Clock },
    { label: "Lesson:", value: `${topicCount} Lessons`, icon: PlayCircle },
    { label: "Level:", value: levelCapitalized, icon: Layers },
    { label: "Language:", value: "English", icon: Languages },
  ]

  return (
    <div className="flex flex-col gap-6">
      <aside className="w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 pt-4 pr-3.5 pb-[25px]">
        <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
          Course information
        </h2>

        <div className="mt-6 flex flex-col">
          {infoItems.map((item, index) => (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-4 py-0">
                <span className="inline-flex items-center gap-2 text-base leading-normal font-medium text-ma-text">
                  <item.icon className="size-5 shrink-0 text-[#6b7280]" />
                  {item.label}
                </span>
                <span className="text-base leading-normal font-medium whitespace-nowrap text-ma-text">
                  {item.value}
                </span>
              </div>

              <div
                className={
                  index < infoItems.length - 1
                    ? "my-4 border-t border-dashed border-[#d9d9d9]"
                    : "mt-4 border-t border-dashed border-[#d9d9d9]"
                }
              />
            </div>
          ))}

          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-base leading-normal font-medium text-ma-text">
              <TagIcon className="size-5 shrink-0 text-[#6b7280]" />
              Price
            </span>
            {isFree ? (
              <span className="text-sm font-semibold text-green-600">Free</span>
            ) : numericPrice > 0 ? (
              <div className="text-right">
                <span className="text-sm font-semibold">${salePrice.toFixed(2)}</span>
                {discount > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    ${numericPrice.toFixed(2)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Not set</span>
            )}
          </div>
        </div>
      </aside>

      {modules.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
            Course Module
          </h2>
          {modules.map((mod) => (
            <ModuleAccordion
              key={mod.id}
              title={mod.title}
              topics={mod.topics}
            />
          ))}
        </div>
      )}
    </div>
  )
}
