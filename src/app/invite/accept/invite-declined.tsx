import { Copy, Check } from "lucide-react"
import { cn } from "@/shared/utils"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"

export function InviteDeclined({
  invitedByEmail,
  copied,
  onCopy,
  onGoHome,
}: {
  invitedByEmail?: string | null
  copied: boolean
  onCopy: () => void
  onGoHome: () => void
}) {
  const adminEmail = invitedByEmail ?? ""

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <span className="text-3xl">✕</span>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold tracking-tight-lg text-foreground">
              Invitation Declined
            </h2>
            <div className="mt-2 text-sm text-muted-foreground">
              You&apos;ve declined the invitation. If you changed your mind or
              received this by mistake, contact{" "}
              {adminEmail ? (
                <span className="group inline-flex flex-row-reverse items-center gap-1 align-middle">
                  <a
                    href={`mailto:${adminEmail}`}
                    className="text-muted-foreground underline transition-colors duration-300 hover:text-primary"
                  >
                    {adminEmail}
                  </a>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-out",
                      copied
                        ? "max-w-4 opacity-100"
                        : "max-w-0 opacity-0 group-hover:max-w-4 group-hover:opacity-100"
                    )}
                  >
                    <button
                      type="button"
                      onClick={onCopy}
                      className="inline-flex items-center justify-center"
                      aria-label="Copy email"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-primary" />
                      ) : (
                        <Copy className="size-3.5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                      )}
                    </button>
                  </div>
                </span>
              ) : (
                "the admin"
              )}{" "}
              to request a new invite.
            </div>
          </div>

          <Button variant="default" onClick={onGoHome} className="h-11 w-full">
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
