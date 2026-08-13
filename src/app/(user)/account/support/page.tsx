"use client"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useEffect } from "react"
import { Controller } from "react-hook-form"

import { useSession } from "@/shared/hooks/use-session"
import { useContactForm } from "@/shared/hooks/use-contact-form"
import { MarketingButton } from "@/shared/ui/marketing-button"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export default function AccountSupportPage() {
  const { user } = useSession()
  const { form, submitting, onSubmit } = useContactForm()

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
  return (
    <main className="w-full overflow-hidden bg-white text-ma-text">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-card-2 bg-ma-surface-2 px-4 py-7.5 md:max-w-lg lg:w-[600px] lg:p-[30px]"
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

          <MarketingButton
            type="submit"
            disabled={submitting}
            className="mt-1 w-full"
          >
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
          </MarketingButton>
        </div>
      </form>{" "}
    </main>
  )
}
