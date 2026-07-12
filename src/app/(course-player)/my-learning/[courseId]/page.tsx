import { CoursePlayerShell } from "@/features/user-dashboard/components/course-player-shell"

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  return <CoursePlayerShell courseId={courseId} />
}
