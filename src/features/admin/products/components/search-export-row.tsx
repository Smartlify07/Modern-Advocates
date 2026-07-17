import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { SearchIcon, UploadIcon } from "lucide-react"

interface SearchExportRowProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function SearchExportRow({
  placeholder,
  value,
  onChange,
}: SearchExportRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="h-[44px] w-[300px] rounded-[8px] pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
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
