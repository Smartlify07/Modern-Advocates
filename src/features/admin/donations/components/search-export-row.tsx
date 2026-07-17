import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { SearchIcon, UploadIcon, ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/ui/dropdown-menu"

interface SearchExportRowProps {
  search: string
  typeFilter: string
  onSearchChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
}

const filterOptions = [
  { value: "all", label: "All Donations" },
  { value: "fixed", label: "Fixed Donation" },
  { value: "tier", label: "Tier Donation" },
  { value: "monthly", label: "Monthly Donation" },
]

export function SearchExportRow({
  search,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
}: SearchExportRowProps) {
  const activeLabel =
    filterOptions.find((o) => o.value === typeFilter)?.label ?? "All Donations"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="h-[44px] w-[300px] rounded-[8px] pl-9"
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
          <DropdownMenuContent className="rounded-[8px]" align="start">
            <DropdownMenuRadioGroup
              className="space-y-1"
              value={typeFilter}
              onValueChange={onTypeFilterChange}
            >
              {filterOptions.map((opt) => (
                <DropdownMenuRadioItem
                  key={opt.value}
                  value={opt.value}
                  className="rounded-[8px] p-2 data-[state=checked]:bg-ma-admin-primary data-[state=checked]:text-primary-foreground [&_svg]:hidden"
                >
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        variant="outline"
        className="h-[44px] min-w-[115px] gap-2.5 rounded-[8px] border-ma-admin-primary bg-white text-ma-admin-primary hover:bg-ma-admin-primary hover:text-white"
      >
        Export
        <UploadIcon className="size-4" />
      </Button>
    </div>
  )
}
