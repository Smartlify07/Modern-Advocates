import { Button } from "@/shared/ui/button"
import { UploadIcon } from "lucide-react"

interface ExportButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function ExportButton({ onClick, disabled = false }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-11 min-w-[115px] gap-2.5 rounded-8 border-ma-admin-primary bg-white text-ma-admin-primary hover:bg-ma-admin-primary hover:text-white disabled:hover:bg-white disabled:hover:text-ma-admin-primary"
      onClick={onClick}
      disabled={disabled}
    >
      Export
      <UploadIcon className="size-4" />
    </Button>
  )
}