"use client"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"

import { useSession } from "@/shared/hooks/use-session"
import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { apiFetch } from "@/shared/lib/api-fetch"

const contactFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})

export default function AccountSupportPage() {
  const { user } = useSession()

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: "",
        message: "",
      })
    }
  }, [user, form])
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(data: z.infer<typeof contactFormSchema>) {
    setSubmitting(true)
    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: data,
      })

      toast.success("Your message has been sent successfully!")
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <main className="w-full overflow-hidden bg-white text-ma-text">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-card-2 bg-ma-surface-2 px-4 py-7.5 lg:w-[600px] lg:p-[30px]"
      >
        <div className="flex flex-col gap-5">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="text-lg font-normal text-ma-text"
                >
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="name"
                  placeholder="Justine Ryan"
                  aria-invalid={fieldState.invalid}
                  className="h-11 rounded-md border-border bg-white px-2.5 py-2.5 text-base placeholder:text-muted-foreground"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-lg font-normal text-ma-text"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-md border-border bg-white px-2.5 py-2.5 text-base placeholder:text-muted-foreground"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-lg font-normal text-ma-text"
                  >
                    Phone number
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+10000023045"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-md border-border bg-white px-2.5 py-2.5 text-base placeholder:text-muted-foreground"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="text-lg font-normal text-ma-text"
                >
                  Message
                </FieldLabel>
                <textarea
                  {...field}
                  id={field.name}
                  placeholder="Type your message..."
                  aria-invalid={fieldState.invalid}
                  className="h-[180px] w-full min-w-0 resize-none rounded-md border border-border bg-white px-2.5 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="group relative mt-1 h-pill w-full overflow-hidden rounded-pill bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
          >
            <span className="relative z-10 inline-flex items-center gap-2.5">
              {submitting && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Send your message
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                aria-hidden="true"
              />
            </span>
            <div className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Button>
        </div>
      </form>{" "}
    </main>
  )
}
