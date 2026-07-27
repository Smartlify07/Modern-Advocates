import { Suspense } from "react"
import { LoaderCircle } from "lucide-react"
import InviteAcceptContent from "./content"

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  )
}