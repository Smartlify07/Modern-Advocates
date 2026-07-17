"use client"

import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { SearchIcon } from "lucide-react"
import type { Filter } from "./types"

const filterOptions = ["All Courses", "Published", "Draft", "Archived"] as const

export default function CoursesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: {
  search: string
  onSearchChange: (v: string) => void
  filter: Filter
  onFilterChange: (v: Filter) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-72">
        <SearchIcon
          strokeWidth={1.5}
          className="absolute start-5 top-1/2 size-5.25 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search courses..."
          className="h-[44px] max-w-[300px] rounded-[8px] pl-14 text-sm placeholder:text-sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={filter} onValueChange={(v) => onFilterChange(v as Filter)}>
        <SelectTrigger className="w-40 rounded-[8px] data-[size=default]:h-[44px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          className="min-w-40 translate-x-0 rounded-[8px]"
        >
          {filterOptions.map((option) => (
            <SelectItem
              className="rounded-[8px] p-2"
              key={option}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
