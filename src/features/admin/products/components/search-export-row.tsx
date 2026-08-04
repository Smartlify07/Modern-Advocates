import { Input } from "@/shared/ui/input"
import { SearchIcon } from "lucide-react"
import { ExportButton } from "@/shared/ui/export-button"

interface SearchExportRowProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onExport: () => void
  exportDisabled?: boolean
}

export function SearchExportRow({
  placeholder,
  value,
  onChange,
  onExport,
  exportDisabled = false,
}: SearchExportRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="h-11 w-[300px] rounded-8 pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <ExportButton onClick={onExport} disabled={exportDisabled} />
    </div>
  )
}
