"use client"

import { useRef, useState } from "react"
import {
  useCourseWizardStore,
  type Topic,
} from "@/features/courses/store/use-course-wizard-store"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import {
  GripVerticalIcon,
  VideoIcon,
  FileTextIcon,
  XIcon,
  Trash2Icon,
} from "lucide-react"

export function TopicRow({
  moduleId,
  topic,
}: {
  moduleId: string
  topic: Topic
}) {
  const updateTopic = useCourseWizardStore((s) => s.updateTopic)
  const removeTopic = useCourseWizardStore((s) => s.removeTopic)
  const [mediaOpen, setMediaOpen] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const pendingTypeRef = useRef<Topic["type"]>("video")

  const hasVideo = !!topic.videoFile || !!topic.videoId
  const showPopover = !hasVideo && !topic.description
  const showTextarea = topic.type === "text" && !!topic.description
  const videoLabel =
    topic.videoFile?.name || topic.videoTitle || topic.title || "Video"

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateTopic(moduleId, topic.id, {
        type: pendingTypeRef.current,
        videoFile: file,
      })
    }
    if (videoInputRef.current) videoInputRef.current.value = ""
    setMediaOpen(false)
  }

  const handleReplaceVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateTopic(moduleId, topic.id, {
        videoFile: file,
        videoId: null,
      })
    }
    if (replaceInputRef.current) replaceInputRef.current.value = ""
  }

  const handleSetType = (type: Topic["type"]) => {
    pendingTypeRef.current = type
    if (type === "text" && !topic.description) {
      updateTopic(moduleId, topic.id, { type, description: " " })
    } else {
      updateTopic(moduleId, topic.id, { type })
    }
    if (type !== "text") {
      setTimeout(() => videoInputRef.current?.click(), 0)
    }
    setMediaOpen(false)
  }

  return (
    <div className="flex items-start gap-2 py-1.5">
      <GripVerticalIcon className="mt-3 size-4 shrink-0 cursor-grab text-slate-300" />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoSelect}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleReplaceVideo}
      />

      <div className="flex flex-1 flex-col gap-2">
        <Input
          value={topic.title}
          onChange={(e) =>
            updateTopic(moduleId, topic.id, { title: e.target.value })
          }
          placeholder="Topic name"
          className="h-11 rounded-8 text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        {hasVideo && (
          <div className="flex flex-col gap-0.5">
            <div className="text-ma-primary flex items-center gap-1 rounded py-1 text-xs">
              <VideoIcon className="size-3.5 shrink-0" />
              <span className="max-w-36 truncate">{videoLabel}</span>
            </div>
            <button
              type="button"
              onClick={() => replaceInputRef.current?.click()}
              className="text-start text-[10px] text-blue-400 underline hover:text-blue-600"
            >
              Replace
            </button>
          </div>
        )}
        {showPopover ? (
          <Popover open={mediaOpen} onOpenChange={setMediaOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-fit bg-ma-admin-primary/10 px-2.5 text-xs text-ma-admin-primary hover:bg-ma-admin-primary/20"
              >
                Add Media +
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button
                type="button"
                onClick={() => handleSetType("video")}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-100"
              >
                <VideoIcon className="size-4 text-slate-500" />
                Video
              </button>
              <button
                type="button"
                onClick={() => handleSetType("text")}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-100"
              >
                <FileTextIcon className="size-4 text-slate-500" />
                Lecture Notes
              </button>
            </PopoverContent>
          </Popover>
        ) : showTextarea ? (
          <div className="flex items-start gap-1.5">
            <textarea
              value={topic.description.trim() ? topic.description : ""}
              onChange={(e) =>
                updateTopic(moduleId, topic.id, {
                  description: e.target.value,
                })
              }
              placeholder="Write your notes here..."
              className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {topic.description && (
              <button
                type="button"
                onClick={() =>
                  updateTopic(moduleId, topic.id, { description: "" })
                }
                className="mt-1 shrink-0 text-red-400 hover:text-red-600"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => removeTopic(moduleId, topic.id)}
          className="text-red-400 hover:text-red-400"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </div>
  )
}
