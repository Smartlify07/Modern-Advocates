import { LoaderCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/ui/card"
import { UserAvatar } from "@/shared/ui/user-avatar"
import { formatInviteDate } from "./types"

export function InviteInvitationCard({
  invitedByName,
  role,
  declineLoading,
  acceptLoading,
  onDecline,
  onAccept,
}: {
  invitedByName?: string | null
  role: string
  declineLoading: boolean
  acceptLoading: boolean
  onDecline: () => void
  onAccept: () => void
}) {
  const inviteDate = formatInviteDate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-start gap-1 pb-4">
          <p className="text-xs text-muted-foreground">{inviteDate}</p>
          <h2 className="text-xl font-semibold text-foreground">Pending invite</h2>
        </CardHeader>

        <CardContent className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="size-16">
            <UserAvatar user={{ name: invitedByName }} className="size-16" fallbackClassName="text-xl" />
          </div>

          <h3 className="text-xl text-foreground">
            <span className="font-medium">{invitedByName ?? "Someone"}</span>
            {" invited you to join as "}
            <span className="font-medium">{role}</span>
          </h3>

          <p className="max-w-sm text-sm text-muted-foreground">
            You&apos;ve been invited to join the team at <span className="font-medium text-primary">Modern Advocates</span>. Accept the invitation to
            start collaborating with the team.
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between bg-transparent pt-6">
          <span className="text-xs text-muted-foreground">
            Your invitation expires in 7 days.
          </span>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onDecline} className="h-11 w-[70px]" disabled={declineLoading || acceptLoading}>
              {declineLoading ? <LoaderCircle className="size-4 animate-spin text-primary" /> : "Decline"}
            </Button>
            <Button variant="default" onClick={onAccept} className="h-11 w-[135px]" disabled={acceptLoading || declineLoading}>
              {acceptLoading ? <LoaderCircle className="size-4 animate-spin text-primary-foreground" /> : "Accept invitation"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
