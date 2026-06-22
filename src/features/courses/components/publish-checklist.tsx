"use client"

import { CheckCircle2Icon, CircleIcon, AlertCircleIcon } from "lucide-react"

interface ChecklistItem {
  label: string
  status: "complete" | "incomplete" | "warning"
  onClick?: () => void
}

function Item({ label, status, onClick }: ChecklistItem) {
  const Icon =
    status === "complete" ? CheckCircle2Icon : status === "warning" ? AlertCircleIcon : CircleIcon
  const color =
    status === "complete"
      ? "text-green-600"
      : status === "warning"
        ? "text-amber-500"
        : "text-muted-foreground"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex items-center gap-2 text-sm disabled:cursor-default"
    >
      <Icon className={`size-4 shrink-0 ${color}`} />
      <span className={status === "complete" ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </button>
  )
}

interface Props {
  title: string
  categoryId: string
  level: string
  hasModules: boolean
  hasPricing: boolean
  hasThumbnail: boolean
  onNavigate: (tab: string) => void
}

export function PublishChecklist({ title, categoryId, level, hasModules, hasPricing, hasThumbnail, onNavigate }: Props) {
  const items: ChecklistItem[] = [
    {
      label: "Basic info complete",
      status: title && categoryId ? "complete" : "incomplete",
      onClick: () => onNavigate("Basic Info"),
    },
    {
      label: "Course level set",
      status: level ? "complete" : "incomplete",
    },
    {
      label: "Course content added",
      status: hasModules ? "complete" : "incomplete",
      onClick: () => onNavigate("Course Content"),
    },
    {
      label: "Pricing configured",
      status: hasPricing ? "complete" : "warning",
      onClick: () => onNavigate("Pricing"),
    },
    {
      label: "Thumbnail uploaded",
      status: hasThumbnail ? "complete" : "warning",
      onClick: () => onNavigate("Basic Info"),
    },
  ]

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => (
        <Item key={item.label} {...item} />
      ))}
    </div>
  )
}
