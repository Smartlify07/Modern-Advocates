"use client"

import { useState } from "react"
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

const formSchema = z.object({
  name: z.string({ message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { error: "Must be more than 8 characters" }),
})

export default function Page() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSuccess(false)
    setError("")

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? "Something went wrong")
      return
    }

    setSuccess(true)
    form.reset()
  }

  return (
    <div className={cn("flex min-h-svh items-center justify-center px-4")}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin</CardTitle>
          <CardDescription>
            Create a new admin user with full access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <p className="mb-4 text-sm font-medium text-emerald-600">
              Admin user created successfully.
            </p>
          )}
          {error && (
            <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ fieldState, field }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="James Smith"
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
                      placeholder="admin@example.com"
                    />
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
                      Must be at least 8 characters.
                    </FieldDescription>
                  </Field>
                )}
              />

              <Field>
                <Button type="submit">Create Admin</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
