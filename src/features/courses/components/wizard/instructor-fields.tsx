"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { UploadIcon, ImageIcon } from "lucide-react"

export function InstructorFields() {
  const instructorName = useCourseWizardStore((s) => s.instructorName)
  const setInstructorName = useCourseWizardStore((s) => s.setInstructorName)
  const instructorSpecialty = useCourseWizardStore((s) => s.instructorSpecialty)
  const setInstructorSpecialty = useCourseWizardStore(
    (s) => s.setInstructorSpecialty
  )
  const aboutInstructor = useCourseWizardStore((s) => s.aboutInstructor)
  const setAboutInstructor = useCourseWizardStore((s) => s.setAboutInstructor)
  const instructorPhoto = useCourseWizardStore((s) => s.instructorPhoto)
  const instructorPhotoPreview = useCourseWizardStore(
    (s) => s.instructorPhotoPreview
  )
  const setInstructorPhoto = useCourseWizardStore((s) => s.setInstructorPhoto)

  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    if (instructorPhoto) {
      const url = URL.createObjectURL(instructorPhoto)
      setLocalPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    if (instructorPhotoPreview && instructorPhotoPreview.startsWith("http")) {
      setLocalPreview(instructorPhotoPreview)
    } else {
      setLocalPreview(null)
    }
  }, [instructorPhoto, instructorPhotoPreview])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setInstructorPhoto(f)
  }

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

      <div className="mt-6 border-t border-slate-200 pt-6">
        <label className="mb-2 block text-sm font-normal text-primary">
          Instructor Photo
        </label>
        <div className="flex items-start gap-6">
          {localPreview ? (
            <div className="relative flex h-25 w-30 shrink-0 items-center justify-center overflow-hidden bg-slate-50">
              <Image
                src={localPreview}
                alt="Instructor"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-25 w-30 shrink-0 items-center justify-center bg-slate-50">
              <ImageIcon className="size-12 text-slate-300" />
            </div>
          )}
          <div className="flex flex-col gap-6 pt-1">
            <p className="max-w-[528px] text-sm leading-relaxed text-slate-500">
              Upload your instructor photo here.{" "}
              <span className="font-normal text-primary">
                Supported format:
              </span>{" "}
              <span className="font-normal text-primary">
                .jpg, .jpeg, or .png
              </span>
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFile}
            />
            <Button
              type="button"
              variant="ghost"
              className="h-[44px] w-fit flex-row-reverse rounded-[8px] bg-slate-100 text-primary hover:bg-slate-200"
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon className="mr-1 size-4" />
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
