"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Portuguese",
]
const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]
const durationUnits = ["Minutes", "Hours", "Days", "Weeks"]

export function CourseMetadataFields() {
  const language = useCourseWizardStore((s) => s.language)
  const setLanguage = useCourseWizardStore((s) => s.setLanguage)
  const level = useCourseWizardStore((s) => s.level)
  const setLevel = useCourseWizardStore((s) => s.setLevel)
  const duration = useCourseWizardStore((s) => s.duration)
  const setDuration = useCourseWizardStore((s) => s.setDuration)
  const durationUnit = useCourseWizardStore((s) => s.durationUnit)
  const setDurationUnit = useCourseWizardStore((s) => s.setDurationUnit)

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="mb-2 block text-sm font-normal">
          Course Language
        </label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full rounded-[8px] data-[size=default]:h-[44px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="flex flex-col gap-1 p-2">
            {languages.map((l) => (
              <SelectItem
                key={l}
                value={l}
                className="px-4 py-2 not-last:mb-1 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-white data-[state=checked]:hover:text-white"
              >
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-normal">Course Level</label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full rounded-[8px] data-[size=default]:h-[44px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="space-y-1 p-2">
            {levels.map((l) => (
              <SelectItem
                key={l.value}
                value={l.value}
                className="px-4 py-2 not-last:mb-1 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-white data-[state=checked]:hover:text-white"
              >
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-normal">Duration*</label>
        <div className="flex gap-3">
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration"
            type="number"
            min="0"
            className="flex-1[appearance:textfield] h-[44px] rounded-[8px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <Select value={durationUnit} onValueChange={setDurationUnit}>
            <SelectTrigger className="w-1/2 rounded-[8px] data-[size=default]:h-[44px]">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent className="space-y-1 p-2">
              {durationUnits.map((u) => (
                <SelectItem
                  key={u}
                  value={u}
                  className="px-4 py-2 not-last:mb-1 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-white data-[state=checked]:hover:text-white"
                >
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
