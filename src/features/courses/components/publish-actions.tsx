"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Field, FieldLabel } from "@/shared/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Calendar } from "@/shared/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, FileTextIcon, SendIcon, ClockIcon } from "lucide-react"

interface Props {
  level: string
  onLevelChange: (v: string) => void
  onSaveDraft: () => void
  onPublish: () => void
  onSchedule: (date: Date) => void
  canPublish: boolean
}

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export function PublishActions({ level, onLevelChange, onSaveDraft, onPublish, onSchedule, canPublish }: Props) {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date>()

  return (
    <div className="space-y-4 py-4">
      <Field>
        <FieldLabel htmlFor="course-level">Course level</FieldLabel>
        <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger id="course-level" className="w-full">
            <SelectValue placeholder="Select course level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={onSaveDraft}>
          <FileTextIcon className="size-4" />
          Save as Draft
        </Button>

        <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <ClockIcon className="size-4" />
              {scheduleDate ? format(scheduleDate, "MMM d, yyyy") : "Schedule"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={scheduleDate}
              onSelect={(date) => {
                setScheduleDate(date)
                if (date) {
                  onSchedule(date)
                  setScheduleOpen(false)
                }
              }}
              disabled={(d) => d <= new Date()}
            />
          </PopoverContent>
        </Popover>

        <Button onClick={onPublish} disabled={!canPublish}>
          <SendIcon className="size-4" />
          Publish Now
        </Button>
      </div>
    </div>
  )
}
