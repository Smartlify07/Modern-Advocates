"use client"

import { useCourseWizardStore, type Module } from "@/features/courses/store/use-course-wizard-store"
import { Input } from "@/shared/ui/input"
import { TopicRow } from "@/features/courses/components/wizard/topic-row"
import {
  GripVerticalIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

export function ModuleBlock({ module: mod, index }: { module: Module; index: number }) {
  const updateModule = useCourseWizardStore((s) => s.updateModule)
  const removeModule = useCourseWizardStore((s) => s.removeModule)
  const addTopic = useCourseWizardStore((s) => s.addTopic)

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 rounded-t-lg border-b border-slate-200">
        <GripVerticalIcon className="size-4 shrink-0 text-slate-400 cursor-grab" />
        <span className="text-sm font-normal text-slate-500 shrink-0">Module {String(index + 1).padStart(2, "0")}:</span>
        <Input
          value={mod.title}
          onChange={(e) => updateModule(mod.id, e.target.value)}
          placeholder="Week 1: AI, Economic Mobility & Entrepreneurship"
          className="h-[44px] rounded-[8px] text-sm flex-1 min-w-0"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => addTopic(mod.id)}
            className="flex size-7 items-center justify-center rounded text-slate-500 hover:bg-slate-200"
            title="Add Topic"
          >
            <PlusIcon className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded text-slate-500 hover:bg-slate-200"
            title="Edit Module"
          >
            <PencilIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => removeModule(mod.id)}
            className="flex size-7 items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600"
            title="Delete Module"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        </div>
      </div>
      {mod.topics.length > 0 && (
        <div className="px-3 py-2">
          {mod.topics.map((topic) => (
            <TopicRow key={topic.id} moduleId={mod.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}
