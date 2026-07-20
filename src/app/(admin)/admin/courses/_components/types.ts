export interface Course {
  id: string
  title: string
  level: string
  status: "draft" | "published" | "archived"
  price: number
  discountedPrice: number | null
  isFree: boolean
  thumbnailUrl: string | null
  tutorName: string | null
  createdAt: string
}

export const filterOptions = ["All Courses", "Published", "Draft", "Archived"] as const
export type Filter = (typeof filterOptions)[number]
