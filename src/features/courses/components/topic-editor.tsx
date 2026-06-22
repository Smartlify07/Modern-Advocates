"use client"

import { useCallback,  } from "react"

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
import { Trash2Icon, XIcon, UploadIcon } from "lucide-react"

import { TiptapEditor } from "./tiptap-editor"
import type { Topic, TopicType } from "@/features/courses/types"
import {type JSONContent } from '@tiptap/react'
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
  const showVideo = topic.type === "video" || topic.type === "video_and_text"
  const showDescription =
    topic.type === "text" || topic.type === "video_and_text"

  const update = (partial: Partial<Topic>) => {
    onChange({ ...topic, ...partial })
  }

  const handleDescriptionChange = useCallback(
    (json: JSONContent) => {
      update({ description: json })
    },
    [topic]
  )

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
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {showVideo && (
            <div>
              {topic.videoUrl ? (
                <div className="relative overflow-hidden rounded-lg border bg-muted/30">
                  <div className="flex aspect-video items-center justify-center bg-black/5">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <span className="text-xs font-medium">Video URL</span>
                      <span className="max-w-full truncate px-4 text-xs">
                        {topic.videoUrl}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="absolute top-1 right-1"
                    onClick={() => update({ videoUrl: null })}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = window.prompt("Paste a video URL")
                        if (url) update({ videoUrl: url })
                      }}
                    >
                      <UploadIcon className="size-3.5" />
                      Upload
                    </Button>
                    <span className="text-xs text-muted-foreground">or</span>
                    <Input
                      placeholder="Paste a video URL"
                      className="h-7 flex-1 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const url = (e.target as HTMLInputElement).value
                          if (url) update({ videoUrl: url })
                        }
                      }}
                    />
                  </div>
                </div>
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
