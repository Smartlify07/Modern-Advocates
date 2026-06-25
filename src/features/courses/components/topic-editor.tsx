"use client"

import { useCallback, useState } from "react"

import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Trash2Icon, UploadIcon, Loader2 } from "lucide-react"

import { TiptapEditor } from "./tiptap-editor"
import { VideoUploader } from "@/features/videos/components/video-uploader"
import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"
import type { Topic, TopicType } from "@/features/courses/types"
import type { JSONContent } from "@tiptap/react"

interface TopicEditorProps {
  topic: Topic
  onChange: (topic: Topic) => void
  onDelete: () => void
}

const typeLabels: Record<TopicType, string> = {
  video: "Video only",
  text: "Text only",
  video_and_text: "Video and text",
}

export function TopicEditor({ topic, onChange, onDelete }: TopicEditorProps) {
  const courseId = useCourseFormStore((s) => s.courseId)
  const modules = useCourseFormStore((s) => s.modules)
  const activeModuleId = useCourseFormStore((s) => s.activeModuleId)
  const isSaving = useCourseFormStore((s) => s.isSaving)
  const saveAsDraft = useCourseFormStore((s) => s.saveAsDraft)

  const [savingForUpload, setSavingForUpload] = useState(false)

  const showVideo = topic.type === "video" || topic.type === "video_and_text"
  const showDescription = topic.type === "text" || topic.type === "video_and_text"

  const activeModule = modules.find((m) => m.id === activeModuleId)
  const hasRealIds = !!courseId && !!activeModule?.id && !activeModule.id.startsWith("module_")

  const update = (partial: Partial<Topic>) => {
    onChange({ ...topic, ...partial })
  }

  const handleDescriptionChange = useCallback(
    (json: JSONContent) => {
      update({ description: json })
    },
    [topic],
  )

  const handleVideoSuccess = useCallback(
    (videoId: string) => {
      update({ videoId })
    },
    [topic],
  )

  const handleSaveAndUpload = async () => {
    setSavingForUpload(true)
    await saveAsDraft()
    setSavingForUpload(false)
  }

  return (
    <Card className="overflow-hidden ring-0">
      <div className="flex items-stretch">
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={topic.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Topic title"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={topic.type}
              onValueChange={(val) =>
                update({
                  type: val as TopicType,
                  videoUrl: val === "text" ? null : topic.videoUrl,
                  description: val === "video" ? null : topic.description,
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["video", "text", "video_and_text"] as TopicType[]).map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {typeLabels[t]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {showVideo && (
            <div>
              {topic.videoId ? (
                <div className="relative overflow-hidden rounded-lg border bg-muted/30">
                  <div className="flex aspect-video items-center justify-center bg-black/5">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <span className="text-xs font-medium">Video uploaded</span>
                      <span className="max-w-full truncate px-4 text-xs">
                        {topic.videoId}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="absolute right-1 top-1"
                    onClick={() => update({ videoUrl: null, videoId: null })}
                  >
                    <Trash2Icon className="size-3" />
                  </Button>
                </div>
              ) : hasRealIds ? (
                <VideoUploader
                  courseId={courseId!}
                  moduleId={activeModule!.id}
                  topicId={topic.id}
                  onSuccess={handleVideoSuccess}
                />
              ) : (
                <Button
                  variant="outline"
                  onClick={handleSaveAndUpload}
                  disabled={isSaving || savingForUpload}
                  className="w-full"
                >
                  {isSaving || savingForUpload ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UploadIcon className="size-4" />
                  )}
                  {isSaving || savingForUpload ? "Saving course..." : "Save & Upload Video"}
                </Button>
              )}
            </div>
          )}

          {showDescription && (
            <TiptapEditor
              content={topic.description}
              onChange={handleDescriptionChange}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="my-2 flex w-11 shrink-0 items-center justify-center rounded-sm text-destructive transition-colors hover:bg-destructive hover:[&>svg]:text-white"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </Card>
  )
}
