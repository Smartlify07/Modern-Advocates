export type TopicType = "video" | "text" | "video_and_text"

export interface Topic {
  id: string
  title: string
  type: TopicType
  videoUrl: string | null
  videoId: string | null
  description: unknown
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
  modules: Module[]
  reviews: CourseApiReview[]
  enrollmentCount: number
}
