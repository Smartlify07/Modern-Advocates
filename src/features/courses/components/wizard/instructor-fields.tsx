"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Input } from "@/shared/ui/input"

export function InstructorFields() {
  const instructorName = useCourseWizardStore((s) => s.instructorName)
  const setInstructorName = useCourseWizardStore((s) => s.setInstructorName)
  const instructorSpecialty = useCourseWizardStore((s) => s.instructorSpecialty)
  const setInstructorSpecialty = useCourseWizardStore(
    (s) => s.setInstructorSpecialty
  )
  const aboutInstructor = useCourseWizardStore((s) => s.aboutInstructor)
  const setAboutInstructor = useCourseWizardStore((s) => s.setAboutInstructor)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-normal">
            Instructor Name
          </label>
          <Input
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            placeholder="Instructor name"
            maxLength={120}
            className="h-[44px] rounded-[8px]"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {instructorName.length}/120
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-normal">
            Instructor Specialty
          </label>
          <Input
            value={instructorSpecialty}
            onChange={(e) => setInstructorSpecialty(e.target.value)}
            placeholder="Software Engineer"
            maxLength={120}
            className="h-[44px] rounded-[8px]"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {instructorSpecialty.length}/120
          </p>
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-2 block text-sm font-normal">
          About Instructor
        </label>
        <textarea
          value={aboutInstructor}
          onChange={(e) => setAboutInstructor(e.target.value)}
          placeholder="With 10+ years of experience in ML engineering and applied AI..."
          className="h-28 w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
        />
      </div>
    </div>
  )
}
