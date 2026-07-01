"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { AuthCodeForm } from "@/features/auth/components/auth-code-form"
import { AuthGoogleButton } from "@/features/auth/components/auth-google-button"

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Full name is required" }),
  email: z.email({
    message: "Invalid email address",
  }),
})

type SignupStep = {
  name: string
  email: string
} | null

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [signupStep, setSignupStep] = useState<SignupStep>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSignupStep(data)
  }

  if (signupStep) {
    return (
      <AuthCodeForm
        email={signupStep.email}
        mode="signup"
        onDifferentAccount={() => setSignupStep(null)}
        className={className}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn("flex w-full flex-col items-center gap-[45px]", className)}
      {...props}
    >
      <h1 className="text-center text-4xl leading-normal font-extrabold text-ma-text">
        Sign up with email
      </h1>

      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-[30px]">
          <div className="flex w-full flex-col gap-5">
            <Controller
              control={form.control}
              name="name"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Full Name"
                    className="h-11 rounded-md border-[#6b7280] px-5 py-5 text-lg placeholder:text-[#6b7280]"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

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

            <Button
              type="submit"
              className="h-[53px] w-full rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white hover:bg-ma-text/90"
            >
              Continue
            </Button>

            <FieldSeparator className="my-0 w-full text-lg text-[#6b7280] [&_[data-slot=field-separator-content]]:bg-white [&_[data-slot=field-separator-content]]:px-[15px]">
              other sign up option
            </FieldSeparator>
          </div>

          <AuthGoogleButton label="Google" />
        </FieldGroup>
      </form>

      <FieldDescription className="text-center text-[15px] leading-normal text-[#6b7280]">
        By signing up, you agree to our{" "}
        <Link
          href="/terms"
          className="text-ma-text underline underline-offset-2"
        >
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-ma-text underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        .
      </FieldDescription>

      <div className="flex w-full flex-wrap items-center justify-center gap-2.5 rounded-md bg-[#f5f5f5] px-[30px] py-[50px] text-lg leading-normal">
        <FieldDescription className="text-center text-lg leading-normal text-[#6b7280]">
          Already have an account?
        </FieldDescription>
        <Link
          href="/login"
          className="text-lg leading-normal font-semibold text-ma-text underline underline-offset-2"
        >
          Log in
        </Link>
      </div>
    </div>
  )
}
