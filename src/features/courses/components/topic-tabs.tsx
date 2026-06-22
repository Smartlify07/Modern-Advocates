"use client"

import { Button } from "@/shared/ui/button"
import { PlusIcon, FileTextIcon } from "lucide-react"
import type { Topic } from "@/features/courses/types"

interface Props {
  topics: Topic[]
  activeTopicId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
}

export function TopicTabs({ topics, activeTopicId, onSelect, onAdd }: Props) {
  return (
    <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div className="flex items-center gap-1 min-w-0">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
              topic.id === activeTopicId
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            <FileTextIcon className="size-3.5 shrink-0" />
            <span className="max-w-32 truncate">{topic.title || "Untitled"}</span>
          </button>
        ))}
        <Button variant="ghost" size="icon-sm" onClick={onAdd} className="shrink-0">
          <PlusIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
