"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { SectionBlock } from "@/features/courses/components/wizard/section-block"

export function CurriculumStep() {
  const sections = useCourseWizardStore((s) => s.sections)
  const addSection = useCourseWizardStore((s) => s.addSection)

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {sections.map((section, index) => (
          <SectionBlock key={section.id} section={section} index={index} />
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="w-full rounded-lg border-2 border-dashed border-ma-admin-primary/30 bg-ma-admin-primary/10 py-3 text-sm font-medium text-ma-admin-primary hover:bg-ma-admin-primary/20 transition-colors"
      >
        + Add Sections
      </button>
    </div>
  )
}
