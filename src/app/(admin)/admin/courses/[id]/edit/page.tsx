"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Stepper } from "@/shared/ui/stepper"
import { Button } from "@/shared/ui/button"
import { BasicInfoStep } from "@/features/courses/components/wizard/basic-info-step"
import { AdvanceInfoStep } from "@/features/courses/components/wizard/advance-info-step"
import { CurriculumStep } from "@/features/courses/components/wizard/curriculum-step"
import { PublishStep } from "@/features/courses/components/wizard/publish-step"
import { Layers, ClipboardList, MonitorPlay, CirclePlay, XIcon, SaveIcon, ArrowLeftIcon, Loader2, SendIcon } from "lucide-react"
import type { Step } from "@/shared/ui/stepper"

const wizardSteps: Step[] = [
  { title: "Basic Information", icon: Layers },
  { title: "Advance Information", icon: ClipboardList },
  { title: "Curriculum", icon: MonitorPlay },
  { title: "Publish Course", icon: CirclePlay },
]

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const currentStep = useCourseWizardStore((s) => s.currentStep)
  const setCurrentStep = useCourseWizardStore((s) => s.setCurrentStep)
  const completedSteps = useCourseWizardStore((s) => s.completedSteps)
  const setCompletedSteps = useCourseWizardStore((s) => s.setCompletedSteps)
  const isSaving = useCourseWizardStore((s) => s.isSaving)
  const loadFromCourse = useCourseWizardStore((s) => s.loadFromCourse)
  const setCourseId = useCourseWizardStore((s) => s.setCourseId)

  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetch(`/api/courses/${courseId}`).then((r) => r.json()),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (course && !loaded && !isLoading) {
      setCourseId(course.id)
      loadFromCourse(course)
      setLoaded(true)
    }
  }, [course, loaded, isLoading, loadFromCourse, setCourseId])

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
    }
  }

  const handleSaveAndContinue = () => {
    if (currentStep < wizardSteps.length - 1) {
      const newStep = currentStep + 1
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(newStep)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
        <p className="text-muted-foreground">Course not found</p>
        <Button asChild variant="outline">
          <Link href="/admin/courses">Back to courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <Stepper
        steps={wizardSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={setCurrentStep}
      />

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-xl font-semibold lg:text-[36px]">{wizardSteps[currentStep].title}</h1>
        <Button variant="ghost" className="h-12 rounded-[8px] bg-ma-admin-primary px-4 py-2 text-white hover:bg-ma-admin-primary/90" asChild>
          <Link href="/admin/courses">
            <XIcon className="size-4 mr-1" />
            Save & Close
          </Link>
        </Button>
      </div>

      {currentStep === 0 && <BasicInfoStep />}
      {currentStep === 1 && <AdvanceInfoStep />}
      {currentStep === 2 && <CurriculumStep />}
      {currentStep === 3 && <PublishStep />}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handlePrevious} className="h-[44px] rounded-[8px]">
            <ArrowLeftIcon className="size-4 mr-1" />
            Previous
          </Button>
        ) : (
          <div />
        )}
        {currentStep < wizardSteps.length - 1 && (
          <Button onClick={handleSaveAndContinue} disabled={saving} className="h-12 rounded-[8px] bg-ma-admin-primary px-4 py-2 text-white hover:bg-ma-admin-primary/90">
            <SaveIcon className="size-4 mr-1" />
            Save & Continue
          </Button>
        )}
        {currentStep === wizardSteps.length - 1 && (
          <Button className="h-12 rounded-[8px] bg-ma-admin-primary px-4 py-2 text-white hover:bg-ma-admin-primary/90">
            <SendIcon className="size-4 mr-1" />
            Publish
          </Button>
        )}
      </div>
    </div>
  )
}
