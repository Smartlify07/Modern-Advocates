"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { ModuleBlock } from "@/features/courses/components/wizard/module-block"

export function CurriculumStep() {
  const modules = useCourseWizardStore((s) => s.modules)
  const addModule = useCourseWizardStore((s) => s.addModule)

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {modules.map((mod, index) => (
          <ModuleBlock key={mod.id} module={mod} index={index} />
        ))}
      </div>

      <button
        type="button"
        onClick={addModule}
        className="w-full rounded-lg border-2 border-dashed border-ma-admin-primary/30 bg-ma-admin-primary/10 py-3 text-sm font-medium text-ma-admin-primary hover:bg-ma-admin-primary/20 transition-colors"
      >
        + Add Modules
      </button>
    </div>
  )
}
