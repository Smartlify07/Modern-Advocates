"use client"

import { useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { useSaveCourse } from "@/features/courses/hooks/use-course-mutations"
import { Stepper } from "@/shared/ui/stepper"
import { Button } from "@/shared/ui/button"
import { BasicInfoStep } from "@/features/courses/components/wizard/basic-info-step"
import { AdvanceInfoStep } from "@/features/courses/components/wizard/advance-info-step"
import { CurriculumStep } from "@/features/courses/components/wizard/curriculum-step"
import { PublishStep } from "@/features/courses/components/wizard/publish-step"
import {
  Layers,
  ClipboardList,
  MonitorPlay,
  CirclePlay,
  XIcon,
  SaveIcon,
  ArrowLeftIcon,
  SendIcon,
  Loader2,
} from "lucide-react"
import type { Step } from "@/shared/ui/stepper"

const wizardSteps: Step[] = [
  { title: "Basic Information", icon: Layers },
  { title: "Advance Information", icon: ClipboardList },
  { title: "Curriculum", icon: MonitorPlay },
  { title: "Publish Course", icon: CirclePlay },
]

function CourseWizardSkeleton() {
  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-ma-admin-primary" />
      </div>
    </div>
  )
}

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const currentStep = useCourseWizardStore((s) => s.currentStep)
  const setCurrentStep = useCourseWizardStore((s) => s.setCurrentStep)
  const completedSteps = useCourseWizardStore((s) => s.completedSteps)
  const setCompletedSteps = useCourseWizardStore((s) => s.setCompletedSteps)
  const initialize = useCourseWizardStore((s) => s.initialize)
  const setCourseId = useCourseWizardStore((s) => s.setCourseId)
  const resetForm = useCourseWizardStore((s) => s.resetForm)
  const store = useCourseWizardStore.getState
  const saveCourse = useSaveCourse()
  const initialized = useRef(false)

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () =>
      fetch(`/api/courses/${courseId}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch course")
        return r.json()
      }),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (course && !initialized.current && !isLoading) {
      initialize(course)
      setCourseId(course.id)
      initialized.current = true
    }
  }, [course, isLoading, initialize, setCourseId])

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

  const handleSaveAndClose = () => {
    saveCourse.mutate({
      store: store(),
      options: {
        status: "draft",
        courseId,
        onSuccess: () => { resetForm(); router.push("/admin/courses") },
      },
    })
  }

  const handlePublish = () => {
    saveCourse.mutate({
      store: store(),
      options: {
        status: "published",
        courseId,
        onSuccess: () => { resetForm(); router.push("/admin/courses") },
      },
    })
  }

  if (isLoading) {
    return <CourseWizardSkeleton />
  }

  if (!course) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-4 py-20 lg:max-w-7xl 2xl:max-w-360">
        <p className="text-muted-foreground">Course not found</p>
        <Button asChild variant="outline">
          <Link href="/admin/courses">Back to courses</Link>
        </Button>
      </div>
    )
  }

  const isPending = saveCourse.isPending

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <Stepper
        steps={wizardSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={setCurrentStep}
      />

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-xl font-semibold lg:text-[36px]">
          {wizardSteps[currentStep].title}
        </h1>
        <Button
          variant="ghost"
          onClick={handleSaveAndClose}
          disabled={isPending}
          className="h-12 rounded-[8px] bg-ma-admin-primary px-4 py-2 text-white hover:bg-ma-admin-primary/90"
        >
          {isPending ? (
            <Loader2 className="mr-1 size-4 animate-spin" />
          ) : (
            <XIcon className="mr-1 size-4" />
          )}
          Save & Close
        </Button>
      </div>

      {currentStep === 0 && <BasicInfoStep />}
      {currentStep === 1 && <AdvanceInfoStep />}
      {currentStep === 2 && <CurriculumStep />}
      {currentStep === 3 && <PublishStep />}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        {currentStep > 0 ? (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="h-[44px] rounded-[8px]"
          >
            <ArrowLeftIcon className="mr-1 size-4" />
            Previous
          </Button>
        ) : (
          <div />
        )}
        {currentStep < wizardSteps.length - 1 && (
          <Button
            onClick={handleSaveAndContinue}
            className="h-12 rounded-[8px] bg-ma-admin-primary px-4 py-2 text-white hover:bg-ma-admin-primary/90"
          >
            <SaveIcon className="mr-1 size-4" />
            Save & Continue
          </Button>
        )}
        {currentStep === wizardSteps.length - 1 && (
          <Button
            onClick={handlePublish}
            disabled={isPending}
            className="h-12 rounded-[8px] bg-ma-admin-primary px-4 py-2 text-white hover:bg-ma-admin-primary/90"
          >
            {isPending ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : (
              <SendIcon className="mr-1 size-4" />
            )}
            {isPending ? "Saving..." : "Publish"}
          </Button>
        )}
      </div>
    </div>
  )
}
