"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type Topic = { id: string; title: string; format?: string; content?: string | null }
type Module = { id: string; title: string; sortOrder: number; topics: Topic[] }

export function CourseModuleSidebar({ modules }: { modules: Module[] }) {
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(new Set([modules[0]?.id]))
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const toggleWeek = (id: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleLesson = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <aside className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-[#d9d9d9] bg-white p-5">
      <h2 className="text-xl font-bold text-ma-text">Course Module</h2>

      <div className="mt-5 flex flex-col gap-3">
        {modules.map((mod) => {
          const isOpen = openWeeks.has(mod.id)
          const total = mod.topics.length
          const done = mod.topics.filter((t) => completed.has(t.id)).length
          const weekLabel = `Week ${mod.sortOrder + 1}: ${mod.title}`

          return (
            <div key={mod.id} className="rounded-xl border border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => toggleWeek(mod.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ma-text">{weekLabel}</p>
                  <p className="text-xs text-[#6b7280]">{done}/{total} | 1 hr 30 mins</p>
                </div>
                <ChevronDown className={`size-4 text-[#6b7280] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-1 border-t border-[#e5e7eb] px-4 py-2">
                  {mod.topics.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={completed.has(topic.id)}
                        onChange={() => toggleLesson(topic.id)}
                        className="size-4 accent-ma-text"
                      />
                      <div className="flex-1 text-sm text-ma-text">{topic.title}</div>
                      <span className="text-xs text-[#6b7280]">30mins</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
