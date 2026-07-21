"use client"

import { CoursePreviewHero } from "@/features/courses/components/wizard/course-preview-hero"
import { CoursePreviewContent } from "@/features/courses/components/wizard/course-preview-content"

export function CoursePreview() {
  return (
    <div className="overflow-hidden">
      <CoursePreviewHero />
      <CoursePreviewContent />
    </div>
  )
}
