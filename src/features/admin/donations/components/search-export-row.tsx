import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { ExportButton } from "@/shared/ui/export-button"
import { SearchIcon, ChevronDownIcon } from "lucide-react"
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
  onExport: () => void
  exportDisabled?: boolean
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
  onExport,
  exportDisabled = false,
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
            className="h-11 w-[300px] rounded-8 pl-9"
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
          <DropdownMenuContent className="rounded-8" align="start">
            <DropdownMenuRadioGroup
              className="space-y-1"
              value={typeFilter}
              onValueChange={onTypeFilterChange}
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
      <ExportButton onClick={onExport} disabled={exportDisabled} />
    </div>
  )
}
