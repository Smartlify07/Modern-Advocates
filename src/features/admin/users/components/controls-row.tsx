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

interface ControlsRowProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onAddUser: () => void
  role?: string | null
}

export function ControlsRow({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddUser,
  role,
}: ControlsRowProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl/[100%] font-semibold tracking-[-3%]">Users</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="h-[44px] w-[300px] rounded-[8px] pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="rounded-[8px] data-[size=default]:h-11">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="all" className="rounded-[8px] p-2">
                All users
              </SelectItem>
              <SelectItem value="active" className="rounded-[8px] p-2">
                Active
              </SelectItem>
              <SelectItem value="suspended" className="rounded-[8px] p-2">
                Suspended
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
          {(role === "admin" || role === "manager") && (
            <Button
              className="h-[44px] min-w-[186px] gap-2.5 rounded-[8px] bg-ma-admin-primary text-white hover:bg-[#6A4AE0]"
              onClick={onAddUser}
            >
              Add User
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
