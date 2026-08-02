import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import type { OrderSummaryCourseData } from "@/features/user-dashboard/types/checkout"

export function useCourse(courseId: string | null) {
  return useQuery<OrderSummaryCourseData>({
    queryKey: ["course-summary", courseId],
    queryFn: async () => {
      const c = await apiFetch<{
        title: string
        price: number
        discountedPrice: number | null
        thumbnailUrl: string | null
        isFree?: boolean
      }>(`/api/courses/${courseId}`)
      return {
        title: c.title,
        price: c.price,
        discountedPrice: c.discountedPrice,
        thumbnailUrl: c.thumbnailUrl,
        isFree: c.isFree ?? false,
      }
    },
    enabled: !!courseId,
  })
}
