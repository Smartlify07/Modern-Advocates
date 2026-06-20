import type { JSONContent } from "@tiptap/react"

export type TopicType = "video" | "text" | "video_and_text"

export interface Topic {
  id: string
  title: string
  type: TopicType
  videoUrl: string | null
  description: JSONContent | null
  order: number
}

export interface Module {
  id: string
  title: string
  topics: Topic[]
  order: number
}
