import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Button } from "@/shared/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { dateOptions } from "@/features/admin/products/types"

interface DateFilterProps {
  value: string
  onChange: (value: string) => void
}

export function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="min-h-11 bg-white" asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-(--radius-button-medium)"
        >
          {value}
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {dateOptions.map((option) => (
          <DropdownMenuItem
            className="rounded-[8px] p-2"
            key={option}
            onSelect={() => onChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
