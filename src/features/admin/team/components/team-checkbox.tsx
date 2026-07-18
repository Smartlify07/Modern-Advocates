"use client"

import { cn } from "@/shared/utils"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"

interface TeamCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id: string
  label: string
  destructive?: boolean
  disabled?: boolean
}

export function TeamCheckbox({
  checked,
  onCheckedChange,
  id,
  label,
  destructive,
  disabled,
}: TeamCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        id={id}
        className={cn(
          "data-checked:border-ma-admin-primary data-checked:bg-ma-admin-primary data-checked:text-white",
          destructive &&
            "data-checked:border-red-600 data-checked:bg-red-600"
        )}
      />
      <Label htmlFor={id} className={cn(disabled && "opacity-50", "text-lg font-normal")}>
        {label}
      </Label>
    </div>
  )
}
