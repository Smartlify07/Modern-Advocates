"use client"

import { ArrowRight, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"

import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { MarketingButton } from "@/shared/ui/marketing-button"
import { Input } from "@/shared/ui/input"
import { apiFetch } from "@/shared/lib/api-fetch"
import DonationForm from "./donation-form"

const donationTypes = [
  "Fixed Donation",
  "Tier Donation",
  "Monthly Pay",
] as const
const donationAmounts = [100, 200, 1000]

const donationFormSchema = z.object({
  donationType: z.enum(donationTypes),
  amount: z.number().positive("Amount must be greater than 0"),
  donorName: z.string().min(1, "Full name is required"),
  donorEmail: z.email("Please enter a valid email address"),
  confirmation: z.boolean().refine((val) => val === true, {
    message: "You must confirm the donation to proceed",
  }),
})

const donationTypeMap: Record<string, string> = {
  "Fixed Donation": "fixed",
  "Tier Donation": "tier",
  "Monthly Pay": "monthly",
}

export function DonationSupportSection() {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<z.infer<typeof donationFormSchema>>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donationType: "Fixed Donation",
      amount: 0,
      donorName: "",
      donorEmail: "",
      confirmation: false,
    },
  })

  const watchedDonationType = form.watch("donationType")
  const showAmountSelector =
    watchedDonationType === "Tier Donation" ||
    watchedDonationType === "Monthly Pay"

  async function onSubmit(data: z.infer<typeof donationFormSchema>) {
    setSubmitting(true)
    try {
      const result = await apiFetch<{ url: string }>("/api/donations", {
        method: "POST",
        body: {
          amount: data.amount,
          donorName: data.donorName,
          donorEmail: data.donorEmail,
          donationType: donationTypeMap[data.donationType] ?? "fixed",
        },
      })

      window.location.href = result.url
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-[#ECE8FF] py-12.5 text-ma-text lg:py-25">
      <div className="mx-auto grid items-center gap-12 px-4 lg:max-w-7xl lg:grid-cols-2 lg:gap-6 lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="pt-0 lg:pt-2">
          <h2 className="font-sans text-3xl leading-[1.12] font-extrabold text-balance text-primary sm:text-5xl sm:tracking-tight-xl">
            Invest in Hope
          </h2>
          <p className="mt-[30px] max-w-[506px] text-base leading-normal text-primary lg:text-lg">
            Your gift helps fund: <br /> <br />
            AI & Digital Skills Education, Health Advocacy, Patient Resource
            Navigation, Workforce Readiness, Chronic Illness Support, and
            Endometriosis Education.
          </p>
        </div>

        <DonationForm />
      </div>
    </section>
  )
}
