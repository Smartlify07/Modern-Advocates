"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth/client"
import Link from "next/link"

const formSchema = z
  .object({
    name: z.string({
      message: "Name is required",
    }),
    email: z.email({
      message: "Invalid email address",
    }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, { error: "Must be more than 8 characters" }),
    confirmPassword: z
      .string({
        message: "Please confirm your password",
      })
      .min(8, { error: "Must be more than 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      })
      if (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ fieldState, field }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ fieldState, field }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="m@example.com"
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ fieldState, field }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ fieldState, field }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Please confirm your password.
                    </FieldDescription>
                  </Field>
                )}
              />

              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
