"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { OverviewEditor } from "@/features/courses/components/wizard/overview-editor"
import { CourseMetadataFields } from "@/features/courses/components/wizard/course-metadata-fields"
import { InstructorFields } from "@/features/courses/components/wizard/instructor-fields"

export function AdvanceInfoStep() {
  const overview = useCourseWizardStore((s) => s.overview)
  const setOverview = useCourseWizardStore((s) => s.setOverview)

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-normal">
          Course Overview
        </label>
        <OverviewEditor content={overview} onChange={setOverview} />
      </div>

      <div className="border-t border-slate-200" />

      <CourseMetadataFields />

      <div className="border-t border-slate-200" />

      <InstructorFields />
    </div>
  )
}
