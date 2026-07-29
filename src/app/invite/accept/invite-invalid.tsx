import { Button } from "@/shared/ui/button"

export function InviteInvalid({
  error,
  onGoHome,
}: {
  error: string
  onGoHome: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="self-center">
        <h1 className="text-center text-3xl font-semibold tracking-[-3%]">
          Invalid Invitation
        </h1>
        <p className="mt-4 text-center text-muted-foreground">{error}</p>
      </div>
      <Button onClick={onGoHome} variant="outline" className="h-11 w-[154px]">
        Go Home
      </Button>
    </div>
  )
}
