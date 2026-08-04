import CourseDetailPage from "@/features/marketing/components/course-detail-page"

export default function CourseDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <CourseDetailPage params={params} />
}
