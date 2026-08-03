export interface CourseApiReview {
  id: string
  body: string | null
  rating: number
  studentId: string
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

export interface CourseSaveResult {
  id: string
  modules: Array<{
    id: string
    clientId: string
    title: string
    sortOrder: number
    topics: Array<{
      id: string
      clientId: string
      title: string
      sortOrder: number
    }>
  }>
}

export interface CourseListItem {
  id: string
  title: string
  overview: string | null
  thumbnailUrl: string | null
  level: string
  price: number
  discountedPrice: number | null
  duration: number | null
  progress?: number
  instructorName: string | null
  avgRating: number
  reviewCount: number
}

export interface PlayerReview {
  id: string
  body: string | null
  rating: number
  studentId: string
  studentName: string | null
  studentImage: string | null
}

export interface PlayerTutor {
  name: string | null
  image: string | null
  specialty: string | null
  about: string | null
}

export interface PlayerTopic {
  id: string
  title: string
  format: string
  videoId: string | null
  duration: number | null
  content: string | null
}

export interface PlayerModule {
  id: string
  title: string
  sortOrder: number
  topics: PlayerTopic[]
}

export interface PlayerCourse {
  id: string
  title: string
  overview: string | null
  thumbnailUrl: string | null
  duration: number | null
  durationUnit: string | null
  level: string
  language: string
  avgRating: number
  reviewCount: number
  enrollmentCount: number
  tutor: PlayerTutor
  modules: PlayerModule[]
  reviews: PlayerReview[]
}
