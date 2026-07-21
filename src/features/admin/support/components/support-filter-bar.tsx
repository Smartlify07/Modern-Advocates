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
          className="h-[44px] w-full rounded-[8px] pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-[44px] w-[176px] justify-between rounded-[8px] bg-white"
          >
            {activeLabel}
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-[8px]" align="end">
          <DropdownMenuRadioGroup
            className="space-y-1"
            value={filter}
            onValueChange={onFilterChange}
          >
            {filterOptions.map((opt) => (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                className="rounded-[8px] p-2 data-[state=checked]:bg-[#7C3AED] data-[state=checked]:text-primary-foreground [&_svg]:hidden"
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
