"use client"

import { useState } from "react"
import { LoaderCircle, Lock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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

const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "Enter the 6-digit code" }),
})

type AuthCodeFormProps = React.ComponentProps<"div"> & {
  email: string
  mode: "login" | "signup"
  error?: string | null
  onDifferentAccount?: () => void
  onResendCode?: () => void
  onSubmitCode?: (code: string) => void | Promise<void>
}

export function AuthCodeForm({
  className,
  email,
  mode,
  error,
  onDifferentAccount,
  onResendCode,
  onSubmitCode,
  ...props
}: AuthCodeFormProps) {
  const [pending, setPending] = useState(false)
  const form = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  })

  const actionLabel = mode === "login" ? "Log in" : "Sign up"
  const flowLabel = mode === "login" ? "login" : "sign up"
  const switchLabel =
    mode === "login"
      ? "Log in to a different account"
      : "Sign up with a different account"

  const onSubmit = async (data: z.infer<typeof codeSchema>) => {
    setPending(true)
    try {
      await onSubmitCode?.(data.code)
    } catch {
      toast.error(`Failed to ${actionLabel.toLowerCase()}. Please try again.`)
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className={cn("flex w-full flex-col items-center gap-[45px]", className)}
      {...props}
    >
      <div className="flex w-full flex-col items-center gap-[30px] text-center">
        <h1 className="text-4xl leading-normal font-extrabold text-ma-text">
          Check your inbox
        </h1>
        <p className="max-w-[442px] text-lg leading-normal text-[#6b7280]">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-ma-text">{email}</span> to finish
          your {flowLabel}.
        </p>
      </div>

      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <Controller
            control={form.control}
            name="code"
            render={({ fieldState, field }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="sr-only">
                  6-digit code
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="6-digit code"
                    className="h-11 rounded-md border-[#6b7280] px-5 py-5 pr-14 text-lg placeholder:text-[#6b7280]"
                  />
                  <Lock
                    className="pointer-events-none absolute top-1/2 right-5 size-6 -translate-y-1/2 text-[#6b7280]"
                    aria-hidden="true"
                  />
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="group relative h-[53px] w-full overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
              {actionLabel}
            </span>
            <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Button>

          <FieldSeparator className="my-0 w-full [&_[data-slot=field-separator-content]]:bg-white">
            <button
              type="button"
              onClick={onResendCode}
              className="text-lg leading-normal font-medium text-ma-text underline underline-offset-2"
            >
              Resend code
            </button>
          </FieldSeparator>
        </FieldGroup>
      </form>

      <div className="flex w-full items-center justify-center rounded-md bg-[#f5f5f5] px-[30px] py-[50px]">
        {onDifferentAccount ? (
          <button
            type="button"
            onClick={onDifferentAccount}
            className="text-lg leading-normal font-semibold text-ma-text underline underline-offset-2"
          >
            {switchLabel}
          </button>
        ) : (
          <Link
            href={mode === "login" ? "/login" : "/signup"}
            className="text-lg leading-normal font-semibold text-ma-text underline underline-offset-2"
          >
            {switchLabel}
          </Link>
        )}
      </div>

      <FieldDescription className="sr-only">
        Use the code sent to your email address to continue.
      </FieldDescription>
    </div>
  )
}
