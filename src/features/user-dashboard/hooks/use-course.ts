import { useQuery } from "@tanstack/react-query"
import type { OrderSummaryCourseData } from "@/features/user-dashboard/types/checkout"

export function useCourse(courseId: string | null) {
  return useQuery<OrderSummaryCourseData>({
    queryKey: ["course", courseId],
    queryFn: () =>
      fetch(`/api/courses/${courseId}`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch course")
          return r.json()
        })
        .then((c) => ({
          title: c.title,
          price: c.price,
          discountedPrice: c.discountedPrice,
          thumbnailUrl: c.thumbnailUrl,
          isFree: c.isFree ?? false,
        })),
    enabled: !!courseId,
  })
}
