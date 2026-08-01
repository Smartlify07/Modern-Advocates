"use client"

import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { SearchIcon, ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/ui/dropdown-menu"

interface SupportFilterBarProps {
  search: string
  filter: string
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
}

const filterOptions = [
  { value: "all", label: "All Tickets" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
]

export function SupportFilterBar({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: SupportFilterBarProps) {
  const activeLabel =
    filterOptions.find((o) => o.value === filter)?.label ?? "All Tickets"

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-full flex-1">
        <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by customer name, ticket ID, or subject..."
          className="h-11 w-full rounded-8 pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 w-[176px] justify-between rounded-8 bg-white"
          >
            {activeLabel}
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-8" align="end">
          <DropdownMenuRadioGroup
            className="space-y-1"
            value={filter}
            onValueChange={onFilterChange}
          >
            {filterOptions.map((opt) => (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                className="rounded-8 p-2 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-primary-foreground [&_svg]:hidden"
              >
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
