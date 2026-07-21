"use client"

import { useRef, useState } from "react"
import { useCourseWizardStore, type Section, type Lecture } from "@/features/courses/store/use-course-wizard-store"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import {
  GripVerticalIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  VideoIcon,
  FileTextIcon,
  XIcon,
} from "lucide-react"

function LectureRow({ sectionId, lecture }: { sectionId: string; lecture: Lecture }) {
  const updateLecture = useCourseWizardStore((s) => s.updateLecture)
  const removeLecture = useCourseWizardStore((s) => s.removeLecture)
  const [mediaOpen, setMediaOpen] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateLecture(sectionId, lecture.id, {
        mediaType: "video",
        mediaName: file.name,
        mediaUrl: null,
        videoFile: file,
      })
    }
    setMediaOpen(false)
  }

  const handleAddLectureNotes = () => {
    updateLecture(sectionId, lecture.id, {
      mediaType: "lecture_notes",
      mediaName: "Lecture notes",
      mediaUrl: null,
      videoFile: null,
    })
    setMediaOpen(false)
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <GripVerticalIcon className="size-4 shrink-0 text-slate-300 cursor-grab" />
      <Input
        value={lecture.title}
        onChange={(e) => updateLecture(sectionId, lecture.id, { title: e.target.value })}
        placeholder="Lecture name"
        className="h-[44px] rounded-[8px] text-sm flex-1"
      />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
      {lecture.mediaType === "none" ? (
        <Popover open={mediaOpen} onOpenChange={setMediaOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="text-ma-admin-primary bg-ma-admin-primary/10 hover:bg-ma-admin-primary/20 text-xs h-7 px-2.5">
              Add Media +
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-100"
            >
              <VideoIcon className="size-4 text-slate-500" />
              Video
            </button>
            <button
              type="button"
              onClick={handleAddLectureNotes}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-100"
            >
              <FileTextIcon className="size-4 text-slate-500" />
              Lecture Notes
            </button>
          </PopoverContent>
        </Popover>
      ) : lecture.mediaType === "lecture_notes" ? (
        <div className="flex flex-1 items-center gap-1.5">
          <textarea
            value={lecture.notesContent}
            onChange={(e) => updateLecture(sectionId, lecture.id, { notesContent: e.target.value })}
            placeholder="Write your lecture notes here..."
            className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <button
            type="button"
            onClick={() => updateLecture(sectionId, lecture.id, { mediaType: "none", mediaName: null, mediaUrl: null, videoFile: null, notesContent: "" })}
            className="shrink-0 text-red-400 hover:text-red-600"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 bg-ma-admin-primary/10 px-2 py-1 text-xs text-ma-admin-primary">
          {lecture.mediaType === "video" ? (
            <VideoIcon className="size-3.5" />
          ) : (
            <FileTextIcon className="size-3.5" />
          )}
          <span className="max-w-28 truncate">{lecture.mediaName ?? "Media"}</span>
          <button
            type="button"
            onClick={() => updateLecture(sectionId, lecture.id, { mediaType: "none", mediaName: null, mediaUrl: null, videoFile: null, notesContent: "" })}
            className="ml-0.5 text-slate-400 hover:text-slate-600"
          >
            <XIcon className="size-3" />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => removeLecture(sectionId, lecture.id)}
        className="text-red-400 hover:text-red-600"
      >
        <Trash2Icon className="size-4" />
      </button>
    </div>
  )
}

function SectionBlock({ section, index }: { section: Section; index: number }) {
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

export function CurriculumStep() {
  const sections = useCourseWizardStore((s) => s.sections)
  const addSection = useCourseWizardStore((s) => s.addSection)

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {sections.map((section, index) => (
          <SectionBlock key={section.id} section={section} index={index} />
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="w-full rounded-lg border-2 border-dashed border-ma-admin-primary/30 bg-ma-admin-primary/10 py-3 text-sm font-medium text-ma-admin-primary hover:bg-ma-admin-primary/20 transition-colors"
      >
        + Add Sections
      </button>
    </div>
  )
}
