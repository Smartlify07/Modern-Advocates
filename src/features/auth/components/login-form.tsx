"use client"

import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/utils"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthCodeForm } from "@/features/auth/components/auth-code-form"
import { AuthGoogleButton } from "@/features/auth/components/auth-google-button"
import { authClient } from "@/infrastructure/auth/client"
import { isAdminRole } from "@/infrastructure/auth/roles"

const formSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [loginEmail, setLoginEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError(null)
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "sign-in",
      })
      setLoginEmail(data.email)
    } catch {
      const msg = "Failed to send code. Please try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCode = async (code: string) => {
    if (!loginEmail) return
    setError(null)
    const { error: verifyError } =
      await authClient.emailOtp.checkVerificationOtp({
        email: loginEmail,
        otp: code,
        type: "sign-in",
      })
    if (verifyError) {
      const msg = verifyError.message ?? "Invalid or expired code. Please try again."
      setError(msg)
      toast.error(msg)
      return
    }
    const { data, error: signInError } = await authClient.signIn.emailOtp({
      email: loginEmail,
      otp: code,
    })
    if (signInError) {
      const msg = "Failed to sign in. Please try again."
      setError(msg)
      toast.error(msg)
      return
    }
    router.push(isAdminRole(data?.user?.role) ? "/admin" : "/dashboard")
  }

  const handleResendCode = async () => {
    if (!loginEmail) return
    setError(null)
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: loginEmail,
        type: "sign-in",
      })
    } catch {
      const msg = "Failed to resend code. Please try again."
      setError(msg)
      toast.error(msg)
    }
  }

  if (loginEmail) {
    return (
      <AuthCodeForm
        email={loginEmail}
        mode="login"
        error={error}
        onDifferentAccount={() => {
          setLoginEmail(null)
          setError(null)
        }}
        onSubmitCode={handleSubmitCode}
        onResendCode={handleResendCode}
        className={className}
        {...props}
      />
    )
  }

  return (
    <div className={cn("flex flex-col gap-[45px]", className)} {...props}>
      <h1 className="text-center text-[28px]/[100%] leading-normal font-extrabold text-ma-text md:text-4xl">
        Log in to continue your learning journey
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="items-center gap-[30px]">
          <div className="flex w-full flex-col gap-5">
            <Controller
              control={form.control}
              name="email"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    className="h-11 rounded-md border-[#6b7280] px-5 py-5 text-lg placeholder:text-[#6b7280]"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="group relative h-[53px] w-full overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                Continue
              </span>
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>

            <FieldSeparator className="my-0 w-full text-[#6b7280] md:text-lg [&_[data-slot=field-separator-content]]:bg-white [&_[data-slot=field-separator-content]]:px-[15px]">
              other log in option
            </FieldSeparator>
          </div>

          <AuthGoogleButton label="Google" />
        </FieldGroup>
      </form>

      <div className="flex w-full flex-wrap items-center justify-center gap-2.5 rounded-md bg-[#f5f5f5] px-[30px] py-[50px] leading-normal">
        <FieldDescription className="text-center text-base/[100%] text-[#6b7280] md:text-lg">
          Don&apos;t have an account?
        </FieldDescription>
        <Link
          href="/signup"
          className="text-base/[100%] font-semibold text-ma-text underline underline-offset-2 md:text-lg"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
