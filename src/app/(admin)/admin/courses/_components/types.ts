import type { CourseStatus } from "@/features/courses/types"

export interface Course {
  id: string
  title: string | null
  level: string | null
  status: CourseStatus
  price: number
  discountedPrice: number | null
  isFree: boolean
  thumbnailUrl: string | null
  instructorName: string | null
  createdAt: string
}

export const filterOptions = ["All Courses", "Published", "Draft", "Archived"] as const
export type Filter = (typeof filterOptions)[number]
