"use client"

import { ArrowRight, LoaderCircle, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"
import Image from "next/image"

import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

const contactFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "modadvinc@gmail.com",
    href: "mailto:modadvinc@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+(561) 236-7059",
    href: "tel:+15612367059",
  },
]

const socialLinks = [
  { label: "Facebook", src: "/figma-contact/facebook.svg" },
  { label: "LinkedIn", src: "/figma-contact/linkedin.svg" },
  { label: "Instagram", src: "/figma-contact/instagram.svg" },
]

export function ContactHeroSection() {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(data: z.infer<typeof contactFormSchema>) {
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error ?? "Failed to send message")
        setSubmitting(false)
        return
      }

      toast.success("Your message has been sent successfully!")
      form.reset()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-white py-12.5 text-ma-text lg:py-25">
      <div className="mx-auto grid items-start gap-14 px-4 lg:max-w-7xl lg:grid-cols-[444px_1fr] lg:gap-[88px] lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5 lg:gap-[30px]">
            <p className="text-base leading-normal font-medium tracking-[0.1em] text-[#6b7280] uppercase">
              Contact
            </p>
            <h1 className="font-sans text-[28px]/[100%] leading-[1.15] font-extrabold text-balance text-ma-text sm:leading-[70px] lg:text-[55px] lg:tracking-[-5%]">
              Reach out today
            </h1>
            <p className="max-w-[444px] text-base leading-normal text-ma-text lg:text-lg">
              Have questions about our membership and donation programs? Reach
              out using the form below, and our team will get back to you
              promptly.
            </p>
          </div>

          <div className="flex max-w-[320px] flex-col gap-10">
            {contactMethods.map((method) => (
              <a
                key={method.href}
                href={method.href}
                className="flex items-start gap-5 text-base font-medium text-ma-text underline underline-offset-2 transition-colors hover:text-ma-text/70"
                aria-label={`${method.label}: ${method.value}`}
              >
                <method.icon className="mt-0.5 size-6 shrink-0 text-[#6b7280]" />
                <span>{method.value}</span>
              </a>
            ))}

            <address className="flex items-start gap-5 text-base leading-normal text-ma-text not-italic">
              <MapPin className="mt-0.5 size-6 shrink-0 text-[#6b7280]" />
              <span>
                2695 N. Military Trail Suite 22-1012
                <br />
                West Palm Beach,
                <br />
                FL 33409
              </span>
            </address>

            <div className="flex items-center gap-[9px] text-lg">
              <p>Social media:</p>
              <div className="flex items-center gap-2 text-[#6d63ff]">
                {socialLinks.map((social) => (
                  <span
                    key={social.label}
                    className="inline-flex size-7 items-center justify-center"
                    aria-label={social.label}
                    role="img"
                  >
                    <Image
                      src={social.src}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-[24px] bg-[#f5f5f5] px-4 py-7.5 lg:p-[30px]"
        >
          <div className="flex flex-col gap-5">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-lg font-normal text-ma-text">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="name"
                    placeholder="Justine Ryan"
                    aria-invalid={fieldState.invalid}
                    className="h-9 rounded-md border-[#e5e7eb] bg-white px-2.5 py-2.5 text-base placeholder:text-[#6b7280]"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="text-lg font-normal text-ma-text">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="example@gmail.com"
                      aria-invalid={fieldState.invalid}
                      className="h-9 rounded-md border-[#e5e7eb] bg-white px-2.5 py-2.5 text-base placeholder:text-[#6b7280]"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="text-lg font-normal text-ma-text">
                      Phone number
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+10000023045"
                      aria-invalid={fieldState.invalid}
                      className="h-9 rounded-md border-[#e5e7eb] bg-white px-2.5 py-2.5 text-base placeholder:text-[#6b7280]"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-lg font-normal text-ma-text">
                    Message
                  </FieldLabel>
                  <textarea
                    {...field}
                    id={field.name}
                    placeholder="Type your message..."
                    aria-invalid={fieldState.invalid}
                    className="h-[180px] w-full min-w-0 resize-none rounded-md border border-[#e5e7eb] bg-white px-2.5 py-2.5 text-base transition-colors outline-none placeholder:text-[#6b7280] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="group relative mt-1 h-[53px] w-full overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
            >
              <span className="relative z-10 inline-flex items-center gap-2.5">
                {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                Send your message
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                  aria-hidden="true"
                />
              </span>
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
