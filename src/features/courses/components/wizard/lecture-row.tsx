"use client"

import { useRef, useState } from "react"
import { useCourseWizardStore, type Lecture } from "@/features/courses/store/use-course-wizard-store"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import {
  GripVerticalIcon,
  VideoIcon,
  FileTextIcon,
  XIcon,
  Trash2Icon,
} from "lucide-react"

export function LectureRow({ sectionId, lecture }: { sectionId: string; lecture: Lecture }) {
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
    if (videoInputRef.current) videoInputRef.current.value = ""
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
            onClick={() => {
              updateLecture(sectionId, lecture.id, { mediaType: "none", mediaName: null, mediaUrl: null, videoFile: null, notesContent: "" })
              if (videoInputRef.current) videoInputRef.current.value = ""
            }}
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
