"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { authClient } from "@/infrastructure/auth/client"
import { useOtpAuth } from "./use-otp-auth"
import type { ValidateResult, AcceptStep } from "./types"
import { InviteLoading } from "./invite-loading"
import { InviteInvalid } from "./invite-invalid"
import { InviteAccepted } from "./invite-accepted"
import { InviteDeclined } from "./invite-declined"
import { InviteInvitationCard } from "./invite-invitation-card"
import { InviteLogin } from "./invite-login"
import { InviteSignup } from "./invite-signup"

export default function InviteAcceptContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [step, setStep] = useState<AcceptStep>({ type: "loading" })
  const [signupName, setSignupName] = useState("")
  const [signupStep, setSignupStep] = useState<{
    name: string
    email: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const otp = useOtpAuth()

  const validateQuery = useQuery({
    queryKey: ["invite-validate", token],
    queryFn: async () => {
      const r = await fetch(
        `/api/admin/team/invite/validate?token=${encodeURIComponent(token!.trim())}`
      )
      if (!r.ok) throw new Error("Failed to validate invitation. Please try again.")
      return r.json() as Promise<ValidateResult>
    },
    enabled: !!token?.trim(),
    retry: false,
  })

  const { data: session } = authClient.useSession()

  useEffect(() => {
    if (!token?.trim()) {
      setStep({ type: "invalid", error: "No invitation token provided." })
      return
    }
    if (validateQuery.isLoading) return
    if (validateQuery.isError || !validateQuery.data) {
      setStep({
        type: "invalid",
        error: "Failed to validate invitation. Please try again.",
      })
      return
    }
    const result = validateQuery.data
    if (!result.valid) {
      setStep({
        type: "invalid",
        error: result.expired
          ? "This invitation has expired. Please ask your admin to send a new one."
          : "Woops, this invitation link is invalid or has already been used.",
      })
      return
    }
    if (!result.email || !result.role) {
      setStep({ type: "invalid", error: "Invalid invitation data." })
      return
    }
    if (result.alreadyMember) {
      setStep({
        type: "invalid",
        error: "You are already a member of this team.",
      })
      return
    }
    const data = {
      email: result.email,
      role: result.role,
      invitedByName: result.invitedByName,
      invitedByEmail: result.invitedByEmail,
    }
    if (result.userExists && session?.user?.email === result.email)
      setStep({ type: "authenticated", ...data })
    else if (result.userExists && !session?.user)
      setStep({ type: "login", ...data })
    else setStep({ type: "signup", ...data })
  }, [token, validateQuery.data, validateQuery.isLoading, validateQuery.isError, session])

  const acceptMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/team/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token!.trim() }),
      }).then(async (r) => {
        if (!r.ok) {
          const { error } = await r.json()
          throw new Error(error ?? "Failed to accept invitation")
        }
        return r.json()
      }),
    onSuccess: () => {
      setStep({ type: "accepted" })
      toast.success("Welcome to the team!")
      router.push("/admin/dashboard")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const declineMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/team/invite/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token!.trim() }),
      }).then(async (r) => {
        if (!r.ok) throw new Error("Failed to decline invitation")
      }),
    onSuccess: () => {
      if (step.type === "authenticated")
        setStep({
          type: "declined",
          invitedByName: step.invitedByName,
          invitedByEmail: step.invitedByEmail,
        })
      else router.push("/")
    },
    onError: (err: Error) => toast.error(err.message),
  })



  const handleLoginSendOtp = () => {
    if (step.type === "login") otp.sendOtp(step.email)
  }

  const handleLoginSubmitCode = (code: string) => {
    if (step.type !== "login") return
    otp.submitCode(step.email, code).then((ok) => {
      if (ok) acceptMutation.mutate()
    })
  }

  const handleLoginResendCode = () => {
    if (step.type === "login") otp.resendCode(step.email)
  }

  const handleSignupSendOtp = async () => {
    if (!signupName.trim()) {
      otp.setError("Full name is required")
      return
    }
    if (step.type !== "signup") return
    const ok = await otp.sendOtp(step.email)
    if (ok) setSignupStep({ name: signupName.trim(), email: step.email })
  }

  const handleSignupSubmitCode = (code: string) => {
    if (!signupStep) return
    otp.submitCode(signupStep.email, code, signupStep.name).then((ok) => {
      if (ok) acceptMutation.mutate()
    })
  }

  const handleSignupResendCode = () => {
    if (signupStep) otp.resendCode(signupStep.email)
  }

  if (step.type === "loading") return <InviteLoading />
  if (step.type === "invalid")
    return (
      <InviteInvalid error={step.error} onGoHome={() => router.push("/")} />
    )
  if (step.type === "accepted") return <InviteAccepted />
  if (step.type === "declined")
    return (
      <InviteDeclined
        invitedByEmail={step.invitedByEmail}
        copied={copied}
        onCopy={() => {
          navigator.clipboard.writeText(step.invitedByEmail ?? "")
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        onGoHome={() => router.push("/")}
      />
    )
  if (step.type === "authenticated")
    return (
      <InviteInvitationCard
        invitedByName={step.invitedByName}
        role={step.role}
        declineLoading={declineMutation.isPending}
        acceptLoading={acceptMutation.isPending}
        onDecline={() => declineMutation.mutate()}
        onAccept={() => acceptMutation.mutate()}
      />
    )
  if (step.type === "login")
    return (
      <InviteLogin
        email={step.email}
        invitedByName={step.invitedByName}
        role={step.role}
        loginEmail={otp.emailSent}
        loginLoading={otp.loading}
        loginError={otp.error}
        onSendOtp={handleLoginSendOtp}
        onSubmitCode={handleLoginSubmitCode}
        onResendCode={handleLoginResendCode}
      />
    )
  if (step.type === "signup")
    return (
      <InviteSignup
        email={step.email}
        invitedByName={step.invitedByName}
        role={step.role}
        signupName={signupName}
        signupStep={signupStep}
        signupLoading={otp.loading}
        signupError={otp.error}
        onNameChange={setSignupName}
        onSendOtp={handleSignupSendOtp}
        onSubmitCode={handleSignupSubmitCode}
        onResendCode={handleSignupResendCode}
        onDifferentAccount={() => {
          setSignupStep(null)
          setSignupName("")
          otp.reset()
        }}
      />
    )

  return null
}
