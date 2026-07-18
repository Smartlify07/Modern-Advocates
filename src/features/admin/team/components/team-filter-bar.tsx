"use client"

import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { SearchIcon, UploadIcon, PlusIcon } from "lucide-react"

interface TeamFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  onAddMember: () => void
}

export function TeamFilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onAddMember,
}: TeamFilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl/[100%] font-semibold tracking-[-3%]">Team</h1>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team member..."
              className="h-[44px] w-[300px] rounded-[8px] pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[176px] rounded-[8px] data-[size=default]:h-11">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="w-full p-2">
              <SelectItem value="all" className="rounded-[8px] p-2">
                All Types
              </SelectItem>
              <SelectItem value="Admin" className="rounded-[8px] p-2">
                Admin
              </SelectItem>
              <SelectItem value="Manager" className="rounded-[8px] p-2">
                Manager
              </SelectItem>
              <SelectItem value="Editor" className="rounded-[8px] p-2">
                Editor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="h-[44px] min-w-[115px] gap-2.5 rounded-[8px] border-ma-admin-primary bg-white text-ma-admin-primary hover:bg-ma-admin-primary hover:text-white"
          >
            Export
            <UploadIcon className="size-4" />
          </Button>
          <Button
            className="h-[44px] gap-2.5 rounded-[8px] bg-ma-admin-primary text-white hover:bg-[#6A4AE0]"
            onClick={onAddMember}
          >
            <PlusIcon className="size-4" />
            Add Member
          </Button>
        </div>
      </div>
    </div>
  )
}
