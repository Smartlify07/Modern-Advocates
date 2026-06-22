"use client"

import { useEffect } from "react"

import { Button } from "@/shared/ui/button"
import { ArrowLeftIcon, FileTextIcon, PlusIcon } from "lucide-react"

import { ModuleTitle } from "./module-title"
import { TopicTabs } from "./topic-tabs"
import { TopicEditorPanel } from "./topic-editor-panel"
import type { Module, Topic } from "@/features/courses/types"

let nextTopicId = 1
function generateTopicId() { return `topic_${nextTopicId++}` }
function createEmptyTopic(order: number): Topic {
  return { id: generateTopicId(), title: "", type: "video_and_text", videoUrl: null, description: null, order }
}

interface Props {
  module: Module
  onChange: (mod: Module) => void
  activeTopicId: string | null
  onActiveTopicChange: (id: string | null) => void
  onBack: () => void
}

export function ModuleEditor({ module, onChange, activeTopicId, onActiveTopicChange, onBack }: Props) {
  useEffect(() => {
    if (!activeTopicId && module.topics.length > 0) {
      onActiveTopicChange(module.topics[0].id)
    }
  }, [activeTopicId, module.topics.length, onActiveTopicChange])

  const updateModule = (partial: Partial<Module>) => onChange({ ...module, ...partial })
  const updateTopic = (topicId: string, updated: Topic) => {
    updateModule({ topics: module.topics.map((t) => (t.id === topicId ? updated : t)) })
  }

  const deleteTopic = (topicId: string) => {
    const remaining = module.topics.filter((t) => t.id !== topicId).map((t, i) => ({ ...t, order: i }))
    updateModule({ topics: remaining })
    if (activeTopicId === topicId) onActiveTopicChange(remaining[0]?.id ?? null)
  }

  const addTopic = () => {
    const newTopic = createEmptyTopic(module.topics.length)
    updateModule({ topics: [...module.topics, newTopic] })
    onActiveTopicChange(newTopic.id)
  }

  const moveTopic = (index: number, dir: -1 | 1) => {
    const ni = index + dir
    if (ni < 0 || ni >= module.topics.length) return
    const topics = [...module.topics];
    [topics[index], topics[ni]] = [topics[ni], topics[index]]
    updateModule({ topics: topics.map((t, i) => ({ ...t, order: i })) })
  }

  const selIdx = activeTopicId ? module.topics.findIndex((t) => t.id === activeTopicId) : -1
  const selectedTopic = selIdx >= 0 ? module.topics[selIdx] : null
  const currentIdx = selIdx >= 0 ? selIdx : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon className="size-4" />Modules
        </Button>
      </div>

      <ModuleTitle title={module.title} topicCount={module.topics.length} onChange={(t) => updateModule({ title: t })} />

      {module.topics.length > 0 && <TopicTabs topics={module.topics} activeTopicId={activeTopicId} onSelect={onActiveTopicChange} onAdd={addTopic} />}

      {selectedTopic ? (
        <TopicEditorPanel
          topic={selectedTopic}
          onChange={(updated) => updateTopic(selectedTopic.id, updated)}
          onDelete={() => deleteTopic(selectedTopic.id)}
          canMoveUp={currentIdx > 0}
          canMoveDown={currentIdx < module.topics.length - 1}
          onMoveUp={() => moveTopic(currentIdx, -1)}
          onMoveDown={() => moveTopic(currentIdx, 1)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 py-16">
          <FileTextIcon className="size-10 text-muted-foreground/50" />
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">No topics yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add your first topic to start building this module</p>
          </div>
          <Button variant="outline" size="sm" onClick={addTopic}>
            <PlusIcon className="size-3.5" />Add topic
          </Button>
        </div>
      )}
    </div>
  )
}
