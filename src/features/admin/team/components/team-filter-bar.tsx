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
  role?: string | null
}

export function TeamFilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onAddMember,
  role,
}: TeamFilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl leading-none font-semibold tracking-tight-lg">Team</h1>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team member..."
              className="h-11 w-[300px] rounded-8 pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[176px] rounded-8 data-[size=default]:h-11">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="w-full p-2">
              <SelectItem value="all" className="rounded-8 p-2">
                All Types
              </SelectItem>
              <SelectItem value="Admin" className="rounded-8 p-2">
                Admin
              </SelectItem>
              <SelectItem value="Manager" className="rounded-8 p-2">
                Manager
              </SelectItem>
              <SelectItem value="Editor" className="rounded-8 p-2">
                Editor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="h-11 min-w-[115px] gap-2.5 rounded-8 border-ma-admin-primary bg-white text-ma-admin-primary hover:bg-ma-admin-primary hover:text-white"
          >
            Export
            <UploadIcon className="size-4" />
          </Button>
          {(role === "admin" || role === "manager") && (
            <Button
              className="h-11 gap-2.5 rounded-8 bg-ma-admin-primary text-white hover:bg-ma-admin-primary-dark"
              onClick={onAddMember}
            >
              <PlusIcon className="size-4" />
              Add Member
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
