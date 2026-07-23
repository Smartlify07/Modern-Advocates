import { notFound } from "next/navigation"
import { CoursePlayerShell } from "@/features/user-dashboard/components/course-player-shell"

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  if (process.env.NODE_ENV === "development") {
    notFound()
  }

  return <CoursePlayerShell courseId={courseId} />
}
