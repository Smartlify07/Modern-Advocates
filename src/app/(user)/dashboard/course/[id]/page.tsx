import CourseDetailPage from "@/features/marketing/components/course-detail-page"

export default function DashboardCourseRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <CourseDetailPage params={params} breadcrumbHref="/dashboard" />
}
