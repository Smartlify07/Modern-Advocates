import { LoaderCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Card, CardHeader, CardContent } from "@/shared/ui/card"
import { AuthCodeForm } from "@/features/auth/components/auth-code-form"
import { formatInviteDate } from "./types"

export function InviteSignup({
  email,
  invitedByName,
  role,
  signupName,
  signupStep,
  signupLoading,
  signupError,
  onNameChange,
  onSendOtp,
  onSubmitCode,
  onResendCode,
  onDifferentAccount,
}: {
  email: string
  invitedByName?: string | null
  role: string
  signupName: string
  signupStep: { name: string; email: string } | null
  signupLoading: boolean
  signupError: string | null
  onNameChange: (name: string) => void
  onSendOtp: () => void
  onSubmitCode: (code: string) => void
  onResendCode: () => void
  onDifferentAccount: () => void
}) {
  if (signupStep) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-xl font-semibold text-foreground">Create account to join</h1>
          </CardHeader>
          <CardContent>
            <AuthCodeForm
              email={signupStep.email}
              mode="signup"
              error={signupError}
              onDifferentAccount={onDifferentAccount}
              onSubmitCode={onSubmitCode}
              onResendCode={onResendCode}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-1 pb-4">
          <p className="text-xs text-muted-foreground">{formatInviteDate()}</p>
          <h2 className="text-xl font-semibold text-foreground">Pending invite</h2>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-xl text-foreground">
              <span className="font-medium">{invitedByName ?? "Someone"}</span>
              {" invited you to join as "}
              <span className="font-medium">{role}</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Create an account to accept the invitation.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <Input
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => onNameChange(e.target.value)}
              className="h-11 rounded-md border-[#6b7280] px-5 py-5 text-lg placeholder:text-[#6b7280]"
            />
            <Input
              value={email}
              readOnly
              className="h-11 rounded-md border-[#6b7280] bg-muted/50 px-5 py-5 text-lg"
            />
            <Button
              className="h-11 w-full"
              onClick={onSendOtp}
              disabled={signupLoading || !signupName.trim()}
            >
              {signupLoading ? <LoaderCircle className="size-4 animate-spin text-primary-foreground" /> : "Create Account"}
            </Button>
            {signupError && <p className="text-sm text-red-500">{signupError}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
