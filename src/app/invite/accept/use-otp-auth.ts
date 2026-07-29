"use client"

import { useState, useCallback } from "react"
import { authClient } from "@/infrastructure/auth/client"

interface OtpAuthState {
  loading: boolean
  error: string | null
  emailSent: string | null
}

export function useOtpAuth() {
  const [state, setState] = useState<OtpAuthState>({ loading: false, error: null, emailSent: null })

  const sendOtp = useCallback(async (email: string) => {
    setState({ loading: true, error: null, emailSent: null })
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
      setState({ loading: false, error: null, emailSent: email })
      return true
    } catch {
      setState({ loading: false, error: "Failed to send code. Please try again.", emailSent: null })
      return false
    }
  }, [])

  const submitCode = useCallback(async (email: string, code: string, name?: string) => {
    setState(prev => ({ ...prev, error: null }))
    try {
      const params: Record<string, string> = { email, otp: code, type: "sign-in" }
      if (name) params.name = name
      const { error: signInError } = await authClient.signIn.emailOtp(params as any)
      if (signInError) { setState(prev => ({ ...prev, error: "Failed to sign in. Please try again." })); return false }
      return true
    } catch {
      setState(prev => ({ ...prev, error: "Something went wrong. Please try again." }))
      return false
    }
  }, [])

  const resendCode = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, error: null }))
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
    } catch {
      setState(prev => ({ ...prev, error: "Failed to resend code. Please try again." }))
    }
  }, [])

  const reset = useCallback(() => setState({ loading: false, error: null, emailSent: null }), [])

  const setError = useCallback((error: string) => setState(prev => ({ ...prev, error })), [])

  return { ...state, sendOtp, submitCode, resendCode, reset, setError }
}
