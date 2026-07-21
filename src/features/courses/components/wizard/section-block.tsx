"use client"

import { useCourseWizardStore, type Section } from "@/features/courses/store/use-course-wizard-store"
import { Input } from "@/shared/ui/input"
import { LectureRow } from "@/features/courses/components/wizard/lecture-row"
import {
  GripVerticalIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

export function SectionBlock({ section, index }: { section: Section; index: number }) {
  const updateSection = useCourseWizardStore((s) => s.updateSection)
  const removeSection = useCourseWizardStore((s) => s.removeSection)
  const addLecture = useCourseWizardStore((s) => s.addLecture)

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 rounded-t-lg border-b border-slate-200">
        <GripVerticalIcon className="size-4 shrink-0 text-slate-400 cursor-grab" />
        <span className="text-sm font-normal text-slate-500 shrink-0">Sections {String(index + 1).padStart(2, "0")}:</span>
        <Input
          value={section.title}
          onChange={(e) => updateSection(section.id, e.target.value)}
          placeholder="Week 1: AI, Economic Mobility & Entrepreneurship"
          className="h-[44px] rounded-[8px] text-sm flex-1 min-w-0"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => addLecture(section.id)}
            className="flex size-7 items-center justify-center rounded text-slate-500 hover:bg-slate-200"
            title="Add Lecture"
          >
            <PlusIcon className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded text-slate-500 hover:bg-slate-200"
            title="Edit Section"
          >
            <PencilIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => removeSection(section.id)}
            className="flex size-7 items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600"
            title="Delete Section"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        </div>
      </div>
      {section.lectures.length > 0 && (
        <div className="px-3 py-2">
          {section.lectures.map((lecture) => (
            <LectureRow key={lecture.id} sectionId={section.id} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  )
}
