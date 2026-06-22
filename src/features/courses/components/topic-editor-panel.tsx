"use client"

import { Button } from "@/shared/ui/button"
import { ChevronUpIcon, ChevronDownIcon, GripVerticalIcon } from "lucide-react"
import { TopicEditor } from "./topic-editor"
import type { Topic } from "@/features/courses/types"

interface Props {
  topic: Topic
  onChange: (topic: Topic) => void
  onDelete: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}

export function TopicEditorPanel({
  topic,
  onChange,
  onDelete,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 flex items-center gap-0.5">
        <GripVerticalIcon className="size-4 text-muted-foreground/30" />
        <Button variant="ghost" size="icon-xs" onClick={onMoveUp} disabled={!canMoveUp} className="text-muted-foreground">
          <ChevronUpIcon className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" onClick={onMoveDown} disabled={!canMoveDown} className="text-muted-foreground">
          <ChevronDownIcon className="size-3.5" />
        </Button>
      </div>
      <TopicEditor topic={topic} onChange={onChange} onDelete={onDelete} />
    </div>
  )
}
