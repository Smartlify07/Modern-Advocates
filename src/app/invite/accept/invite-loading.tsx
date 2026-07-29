import { LoaderCircle } from "lucide-react"

export function InviteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderCircle className="size-8 animate-spin text-primary" />
    </div>
  )
}
