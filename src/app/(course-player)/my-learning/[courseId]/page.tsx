import { Suspense } from "react"
import { CoursePlayerShell } from "@/features/user-dashboard/components/course-player-shell"

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-white" aria-busy="true" />}
    >
      <CoursePlayerShell courseId={courseId} />
    </Suspense>
  )
}