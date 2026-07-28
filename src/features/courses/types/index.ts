import type { JSONContent } from "@tiptap/react"

export type CourseStatus = "draft" | "published" | "archived"
export type TopicType = "video" | "text" | "video_and_text"

export interface Topic {
  id: string
  title: string
  type: TopicType
  videoUrl: string | null
  videoId: string | null
  videoTitle: string | null
  description: JSONContent | null
  order: number
}

export interface Module {
  id: string
  title: string
  topics: Topic[]
  order: number
}

export interface CourseApiReview {
  id: string
  body: string | null
  rating: number
  studentName: string | null
  studentImage: string | null
}

export interface CourseApiTopic {
  id: string
  title: string
  type: string
  description: unknown
  order: number
  videoUrl: string | null
  videoId: string | null
  videoTitle: string | null
  videoDuration: number | null
}

export interface CourseApiModule {
  id: string
  title: string
  order: number
  topics: CourseApiTopic[]
}

export interface CourseApiResponse {
  id: string
  title: string
  content: string | null
  overview: string | null
  thumbnailUrl: string | null
  language: string
  level: string
  price: string
  discountedPrice: string | null
  duration: number | null
  durationUnit: string | null
  instructorName: string | null
  instructorSpecialty: string | null
  aboutInstructor: string | null
  status: string
  tutorId: string | null
  createdAt: string | null
  updatedAt: string | null
  instructorImage: string | null
  modules: CourseApiModule[]
  reviews: CourseApiReview[]
  enrollmentCount: number
}
