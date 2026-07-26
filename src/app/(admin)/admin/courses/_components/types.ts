export interface Course {
  id: string
  title: string | null
  level: string | null
  status: "draft" | "published" | "archived"
  price: number
  discountedPrice: number | null
  isFree: boolean
  thumbnailUrl: string | null
  instructorName: string | null
  createdAt: string
}

export const filterOptions = ["All Courses", "Published", "Draft", "Archived"] as const
export type Filter = (typeof filterOptions)[number]
