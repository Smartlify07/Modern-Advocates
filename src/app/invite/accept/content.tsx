"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { AuthCodeForm } from "@/features/auth/components/auth-code-form"
import { authClient } from "@/infrastructure/auth/client"

interface ValidateResult {
  valid: boolean
  expired?: boolean
  email?: string
  role?: string
  userExists?: boolean
  alreadyMember?: boolean
  userId?: string | null
  userName?: string | null
}

type AcceptStep =
  | { type: "loading" }
  | { type: "invalid"; error: string }
  | { type: "authenticated"; email: string; role: string }
  | { type: "login"; email: string; role: string }
  | { type: "signup"; email: string; role: string }
  | { type: "accepted" }

export default function InviteAcceptContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [step, setStep] = useState<AcceptStep>({ type: "loading" })

  const [signupName, setSignupName] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signupStep, setSignupStep] = useState<{ name: string; email: string } | null>(null)

  const [loginEmail, setLoginEmail] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const validate = useCallback(async () => {
    if (!token?.trim()) {
      setStep({ type: "invalid", error: "No invitation token provided." })
      return
    }

    try {
      const r = await fetch(`/api/admin/team/invite/validate?token=${encodeURIComponent(token.trim())}`)
      const result: ValidateResult = await r.json()

      if (!result.valid) {
        if (result.expired) {
          setStep({ type: "invalid", error: "This invitation has expired. Please ask your admin to send a new one." })
        } else {
          setStep({ type: "invalid", error: "This invitation link is invalid or has already been used." })
        }
        return
      }

      if (!result.email || !result.role) {
        setStep({ type: "invalid", error: "Invalid invitation data." })
        return
      }

      if (result.alreadyMember) {
        setStep({ type: "invalid", error: "You are already a member of this team." })
        return
      }

      const session = await authClient.getSession()

      if (result.userExists && session?.data?.user && session.data.user.email === result.email) {
        setStep({ type: "authenticated", email: result.email, role: result.role })
      } else if (result.userExists && !session?.data?.user) {
        setStep({ type: "login", email: result.email, role: result.role })
      } else {
        setStep({ type: "signup", email: result.email, role: result.role })
      }
    } catch {
      setStep({ type: "invalid", error: "Failed to validate invitation. Please try again." })
    }
  }, [token])

  useEffect(() => {
    validate()
  }, [validate])

  const handleAccept = async () => {
    try {
      const r = await fetch("/api/admin/team/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token!.trim() }),
      })
      if (!r.ok) {
        const { error } = await r.json()
        throw new Error(error ?? "Failed to accept invitation")
      }
      setStep({ type: "accepted" })
      toast.success("Welcome to the team!")
      router.push("/admin/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to accept invitation")
    }
  }

  const handleSignupSendOtp = async () => {
    if (!signupName.trim()) {
      setSignupError("Full name is required")
      return
    }
    if (step.type !== "signup") return
    setSignupLoading(true)
    setSignupError(null)
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: step.email,
        type: "sign-in",
      })
      setSignupStep({ name: signupName.trim(), email: step.email })
    } catch {
      setSignupError("Failed to send code. Please try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  const handleSignupSubmitCode = async (code: string) => {
    if (!signupStep) return
    setSignupError(null)
    try {
      const { error: signInError } = await authClient.signIn.emailOtp({
        email: signupStep.email,
        otp: code,
        name: signupStep.name,
      })
      if (signInError) {
        setSignupError("Failed to sign in. Please try again.")
        return
      }

      const r = await fetch("/api/admin/team/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token!.trim() }),
      })
      if (!r.ok) {
        const { error } = await r.json()
        toast.error(error ?? "Failed to accept invitation")
        return
      }

      setStep({ type: "accepted" })
      toast.success("Welcome to the team!")
      router.push("/admin/dashboard")
    } catch {
      setSignupError("Something went wrong. Please try again.")
    }
  }

  const handleSignupResendCode = async () => {
    if (!signupStep) return
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: signupStep.email,
        type: "sign-in",
      })
    } catch {
      setSignupError("Failed to resend code. Please try again.")
    }
  }

  const handleLoginSendOtp = async () => {
    if (step.type !== "login") return
    setLoginLoading(true)
    setLoginError(null)
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: step.email,
        type: "sign-in",
      })
      setLoginEmail(step.email)
    } catch {
      setLoginError("Failed to send code. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLoginSubmitCode = async (code: string) => {
    if (!loginEmail) return
    setLoginError(null)
    try {
      const { error: verifyError } = await authClient.emailOtp.checkVerificationOtp({
        email: loginEmail,
        otp: code,
        type: "sign-in",
      })
      if (verifyError) {
        setLoginError(verifyError.message ?? "Invalid or expired code.")
        return
      }
      const { error: signInError } = await authClient.signIn.emailOtp({
        email: loginEmail,
        otp: code,
      })
      if (signInError) {
        setLoginError("Failed to sign in. Please try again.")
        return
      }

      const r = await fetch("/api/admin/team/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token!.trim() }),
      })
      if (!r.ok) {
        const { error } = await r.json()
        toast.error(error ?? "Failed to accept invitation")
        return
      }

      setStep({ type: "accepted" })
      toast.success("Welcome to the team!")
      router.push("/admin/dashboard")
    } catch {
      setLoginError("Something went wrong. Please try again.")
    }
  }

  const handleLoginResendCode = async () => {
    if (!loginEmail) return
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: loginEmail,
        type: "sign-in",
      })
    } catch {
      setLoginError("Failed to resend code. Please try again.")
    }
  }

  if (step.type === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (step.type === "invalid") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-3xl font-bold">Invalid Invitation</h1>
        <p className="text-center text-muted-foreground">{step.error}</p>
        <Button onClick={() => router.push("/")} variant="outline">
          Go Home
        </Button>
      </div>
    )
  }

  if (step.type === "accepted") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-3xl font-bold">Welcome to the team!</h1>
        <p className="text-muted-foreground">Redirecting you to the admin dashboard...</p>
      </div>
    )
  }

  if (step.type === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-center text-3xl font-bold">Team Invitation</h1>
          <p className="text-center text-lg text-muted-foreground">
            You&apos;ve been invited to join as <strong>{step.role}</strong>.
          </p>
          <Button
            className="h-[53px] w-full rounded-[60px] bg-ma-admin-primary text-white hover:bg-ma-admin-primary/80"
            onClick={handleAccept}
          >
            Accept Invitation
          </Button>
        </div>
      </div>
    )
  }

  if (step.type === "login") {
    if (loginEmail) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="mb-6 text-center text-3xl font-bold">Log in to accept</h1>
            <AuthCodeForm
              email={loginEmail}
              mode="login"
              error={loginError}
              onDifferentAccount={() => { setLoginEmail(null); setLoginError(null) }}
              onSubmitCode={handleLoginSubmitCode}
              onResendCode={handleLoginResendCode}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-center text-3xl font-bold">Log in to accept invitation</h1>
          <p className="text-center text-lg text-muted-foreground">
            You&apos;ve been invited to join as <strong>{step.role}</strong>. Log in to accept.
          </p>
          <div className="flex flex-col gap-5">
            <Input
              value={step.email}
              readOnly
              className="h-11 rounded-md border-[#6b7280] bg-muted/50 px-5 py-5 text-lg"
            />
            <Button
              className="group relative h-[53px] w-full overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
              onClick={handleLoginSendOtp}
              disabled={loginLoading}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {loginLoading && <LoaderCircle className="size-4 animate-spin" />}
                Continue
              </span>
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          </div>
        </div>
      </div>
    )
  }

  if (step.type === "signup") {
    if (signupStep) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="mb-6 text-center text-3xl font-bold">Create account to join</h1>
            <AuthCodeForm
              email={signupStep.email}
              mode="signup"
              error={signupError}
              onDifferentAccount={() => { setSignupStep(null); setSignupError(null) }}
              onSubmitCode={handleSignupSubmitCode}
              onResendCode={handleSignupResendCode}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-center text-3xl font-bold">You&apos;re invited!</h1>
          <p className="text-center text-lg text-muted-foreground">
            You&apos;ve been invited to join Modern Advocates as <strong>{step.role}</strong>.
            Create an account to accept.
          </p>
          <div className="flex flex-col gap-5">
            <Input
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="h-11 rounded-md border-[#6b7280] px-5 py-5 text-lg placeholder:text-[#6b7280]"
            />
            <Input
              value={step.email}
              readOnly
              className="h-11 rounded-md border-[#6b7280] bg-muted/50 px-5 py-5 text-lg"
            />
            <Button
              className="group relative h-[53px] w-full overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
              onClick={handleSignupSendOtp}
              disabled={signupLoading || !signupName.trim()}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {signupLoading && <LoaderCircle className="size-4 animate-spin" />}
                Create Account
              </span>
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>
            {signupError && <p className="text-sm text-red-500">{signupError}</p>}
          </div>
        </div>
      </div>
    )
  }

  return null
}