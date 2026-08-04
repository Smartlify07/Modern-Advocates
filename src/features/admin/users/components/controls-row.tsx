"use client"

import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { ExportButton } from "@/shared/ui/export-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { SearchIcon } from "lucide-react"

interface ControlsRowProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onAddUser: () => void
  onExport: () => void
  exportDisabled?: boolean
  role?: string | null
}

export function ControlsRow({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddUser,
  onExport,
  exportDisabled = false,
  role,
}: ControlsRowProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl leading-none font-semibold tracking-tight-lg">Users</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="h-11 w-[300px] rounded-8 pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="rounded-8 data-[size=default]:h-11">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="all" className="rounded-8 p-2">
                All users
              </SelectItem>
              <SelectItem value="active" className="rounded-8 p-2">
                Active
              </SelectItem>
              <SelectItem value="suspended" className="rounded-8 p-2">
                Suspended
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <ExportButton onClick={onExport} disabled={exportDisabled} />
          {(role === "admin" || role === "manager") && (
            <Button
              className="h-11 min-w-[186px] gap-2.5 rounded-8 bg-ma-admin-primary text-white hover:bg-ma-admin-primary-dark"
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
