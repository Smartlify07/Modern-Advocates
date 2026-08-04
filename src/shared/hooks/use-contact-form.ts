"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"
import { apiFetch } from "@/shared/lib/api-fetch"

export const contactFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export function useContactForm(defaultValues?: Partial<ContactFormValues>) {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      message: defaultValues?.message ?? "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
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

  return { form, submitting, onSubmit }
}