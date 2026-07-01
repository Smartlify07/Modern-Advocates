"use client"
import { useState } from "react"
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
import { AuthCodeForm } from "@/features/auth/components/auth-code-form"
import { AuthGoogleButton } from "@/features/auth/components/auth-google-button"

const formSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginEmail, setLoginEmail] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoginEmail(data.email)
  }

  if (loginEmail) {
    return (
      <AuthCodeForm
        email={loginEmail}
        mode="login"
        onDifferentAccount={() => setLoginEmail(null)}
        className={className}
        {...props}
      />
    )
  }

  return (
    <div className={cn("flex flex-col gap-[45px]", className)} {...props}>
      <h1 className="text-center text-4xl leading-normal font-extrabold text-ma-text">
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

            <Button
              type="submit"
              className="h-[53px] w-full rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white hover:bg-ma-text/90"
            >
              Continue
            </Button>

            <FieldSeparator className="my-0 w-full text-lg text-[#6b7280] [&_[data-slot=field-separator-content]]:bg-white [&_[data-slot=field-separator-content]]:px-[15px]">
              other log in option
            </FieldSeparator>
          </div>

          <AuthGoogleButton label="Google" />
        </FieldGroup>
      </form>

      <div className="flex w-full flex-wrap items-center justify-center gap-2.5 rounded-md bg-[#f5f5f5] px-[30px] py-[50px] text-lg leading-normal">
        <FieldDescription className="text-center text-lg leading-normal text-[#6b7280]">
          Don&apos;t have an account?
        </FieldDescription>
        <Link
          href="/signup"
          className="text-lg leading-normal font-semibold text-ma-text underline underline-offset-2"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
