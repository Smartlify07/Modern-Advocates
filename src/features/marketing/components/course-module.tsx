"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function CourseModule({
  title,
  topics,
  open: defaultOpen = false,
}: {
  title: string
  topics?: { id: string; title: string }[]
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
