"use client"

import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, ArrowLeftIcon, ChevronUpIcon, ChevronDownIcon, GripVerticalIcon, FileTextIcon } from "lucide-react"

import { TopicEditor } from "./topic-editor"
import type { Module, Topic } from "./types"

let nextTopicId = 1
function generateTopicId() {
  return `topic_${nextTopicId++}`
}

function createEmptyTopic(order: number): Topic {
  return {
    id: generateTopicId(),
    title: "",
    type: "video_and_text",
    videoUrl: null,
    description: null,
    order,
  }
}

interface ModuleEditorProps {
  module: Module
  onChange: (mod: Module) => void
  activeTopicId: string | null
  onActiveTopicChange: (id: string | null) => void
  onBack: () => void
}

export function ModuleEditor({
  module,
  onChange,
  activeTopicId,
  onActiveTopicChange,
  onBack,
}: ModuleEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  const updateModule = (partial: Partial<Module>) => {
    onChange({ ...module, ...partial })
  }

  const updateTopic = (topicId: string, updated: Topic) => {
    updateModule({
      topics: module.topics.map((t) => (t.id === topicId ? updated : t)),
    })
  }

  const deleteTopic = (topicId: string) => {
    const remaining = module.topics
      .filter((t) => t.id !== topicId)
      .map((t, i) => ({ ...t, order: i }))
    updateModule({ topics: remaining })
    if (activeTopicId === topicId) {
      onActiveTopicChange(remaining[0]?.id ?? null)
    }
  }

  const addTopic = () => {
    const newTopic = createEmptyTopic(module.topics.length)
    updateModule({
      topics: [...module.topics, newTopic],
    })
    onActiveTopicChange(newTopic.id)
  }

  const moveTopic = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= module.topics.length) return
    const topics = [...module.topics]
    ;[topics[index], topics[newIndex]] = [topics[newIndex], topics[index]]
    updateModule({
      topics: topics.map((t, i) => ({ ...t, order: i })),
    })
  }

  const selectedTopicIndex = activeTopicId
    ? module.topics.findIndex((t) => t.id === activeTopicId)
    : -1
  const selectedTopic =
    selectedTopicIndex >= 0 ? module.topics[selectedTopicIndex] : null

  const currentTopicIndex = selectedTopicIndex >= 0 ? selectedTopicIndex : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon className="size-4" />
          Modules
        </Button>
      </div>

      {/* Editable module title */}
      <div className="space-y-1">
        {editingTitle ? (
          <Input
            ref={titleRef}
            value={module.title}
            onChange={(e) => updateModule({ title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingTitle(false)
              }
            }}
            className="h-auto px-0 text-4xl font-heading font-medium text-foreground border-0 border-b border-transparent focus-visible:border-input focus-visible:ring-0 rounded-none pb-1"
            autoFocus
            placeholder="Module title"
          />
        ) : (
          <h1
            className="cursor-text text-4xl font-heading font-medium text-foreground"
            onClick={() => {
              setEditingTitle(true)
              setTimeout(() => titleRef.current?.focus(), 0)
            }}
          >
            {module.title || (
              <span className="text-muted-foreground">Module title</span>
            )}
          </h1>
        )}
        <p className="text-sm text-muted-foreground">
          {module.topics.length} topic{module.topics.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Topic tabs */}
      {module.topics.length > 0 && (
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex items-center gap-1 min-w-0">
            {module.topics.map((topic) => {
              const isActive = topic.id === activeTopicId
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onActiveTopicChange(topic.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <FileTextIcon className="size-3.5 shrink-0" />
                  <span className="max-w-32 truncate">
                    {topic.title || "Untitled"}
                  </span>
                </button>
              )
            })}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={addTopic}
              className="shrink-0"
            >
              <PlusIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Active topic editor or empty state */}
      {selectedTopic ? (
        <div className="relative">
          <div className="absolute right-0 top-0 z-10 flex items-center gap-0.5">
            <GripVerticalIcon className="size-4 text-muted-foreground/30" />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => moveTopic(currentTopicIndex, -1)}
              disabled={currentTopicIndex === 0}
              className="text-muted-foreground"
            >
              <ChevronUpIcon className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => moveTopic(currentTopicIndex, 1)}
              disabled={currentTopicIndex === module.topics.length - 1}
              className="text-muted-foreground"
            >
              <ChevronDownIcon className="size-3.5" />
            </Button>
          </div>
          <TopicEditor
            topic={selectedTopic}
            onChange={(updated) => updateTopic(selectedTopic.id, updated)}
            onDelete={() => deleteTopic(selectedTopic.id)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 py-16">
          <FileTextIcon className="size-10 text-muted-foreground/50" />
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No topics yet
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Add your first topic to start building this module
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addTopic}>
            <PlusIcon className="size-3.5" />
            Add topic
          </Button>
        </div>
      )}
    </div>
  )
}
