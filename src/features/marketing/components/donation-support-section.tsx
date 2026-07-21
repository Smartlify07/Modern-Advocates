"use client"

import { ArrowRight, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"

import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

const donationTypes = ["Fixed Donation", "Tier Donation", "Monthly Pay"] as const
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
    watchedDonationType === "Tier Donation" || watchedDonationType === "Monthly Pay"

  async function onSubmit(data: z.infer<typeof donationFormSchema>) {
    setSubmitting(true)
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: data.amount,
          donorName: data.donorName,
          donorEmail: data.donorEmail,
          donationType: donationTypeMap[data.donationType] ?? "fixed",
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error ?? "Failed to start donation")
        setSubmitting(false)
        return
      }

      window.location.href = result.url
    } catch {
      toast.error("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-white py-12.5 text-ma-text lg:py-25">
      <div className="mx-auto grid items-start gap-12 px-4 lg:max-w-7xl lg:grid-cols-2 lg:gap-6 lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="pt-0 lg:pt-2">
          <h2 className="font-sans text-[28px]/[100%] leading-[1.12] font-extrabold text-balance text-primary lg:text-[60px]/[70px] lg:tracking-[-5%]">
            Support us and make a difference for the future!
          </h2>
          <p className="mt-[30px] max-w-[506px] text-base leading-normal text-primary lg:text-lg">
            Together, we can make a real impact in communities around the world.
            Help us bring hope and support.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-[30px] rounded-[24px] border border-[#d9d9d9] bg-[#f5f5f5] px-4 pt-[30px] pb-7 sm:px-[30px] lg:px-7"
        >
          <div className="border-b border-[#d9d9d9] pb-2.5">
            <h3 className="text-2xl leading-normal font-bold text-black">
              Make Your Donation
            </h3>
          </div>

          <Controller
            control={form.control}
            name="donationType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <legend className="text-xl leading-normal font-semibold text-black">
                  Type of Donation
                </legend>

                <div className="grid gap-3 sm:grid-cols-3">
                  {donationTypes.map((type) => (
                    <label
                      key={type}
                      className="flex min-w-0 items-start gap-2 text-base leading-normal text-[#6b7280]"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={type}
                        checked={field.value === type}
                        onChange={() => field.onChange(type)}
                        aria-invalid={fieldState.invalid}
                        className="mt-0.5 size-5 shrink-0 accent-[#6d63ff]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {showAmountSelector ? (
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <label className="text-xl leading-normal font-semibold text-black">
                    Select Donation Amount
                  </label>
                  <div className="flex flex-col gap-2">
                    {donationAmounts.map((amount) => (
                      <label
                        key={amount}
                        className={`relative cursor-pointer rounded-[6px] ${
                          field.value === amount
                            ? "bg-linear-[90deg] from-[#4F7CF7] from-[0%] to-[#7B5CFF] to-[68.27%] p-[1.1px] pb-[1.3px]"
                            : "border border-[#e5e7eb]"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between rounded-[5px] bg-white px-4 py-2.5 text-base/[100%] font-medium ${
                            field.value === amount
                              ? "text-ma-text"
                              : "text-ma-text"
                          }`}
                        >
                          <span>${amount}</span>
                          <input
                            type="radio"
                            name={field.name}
                            value={amount}
                            checked={field.value === amount}
                            onChange={() => field.onChange(amount)}
                            aria-invalid={fieldState.invalid}
                            className="size-5 accent-[#6d63ff]"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ) : (
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <label htmlFor={field.name} className="sr-only">
                    Donation amount
                  </label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      type="number"
                      inputMode="decimal"
                      placeholder="Enter Amount"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-[6px] border-[#e5e7eb] bg-white px-4 py-2.5 pr-10 text-base placeholder:text-[#6b7280]"
                    />
                    <span
                      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl leading-none font-bold text-ma-text"
                      aria-hidden="true"
                    >
                      $
                    </span>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          <div className="flex flex-col gap-4">
            <h3 className="text-xl leading-normal font-semibold text-black">
              Personal Info
            </h3>

            <Controller
              control={form.control}
              name="donorName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="name"
                    placeholder="Enter full name"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-md border-[#e5e7eb] bg-white px-4 py-2.5 text-base placeholder:text-[#6b7280]"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="donorEmail"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="Enter email"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-md border-[#e5e7eb] bg-white px-4 py-2.5 text-base placeholder:text-[#6b7280]"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="confirmation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="horizontal">
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={field.value === true}
                  onChange={(e) => field.onChange(e.target.checked)}
                  aria-invalid={fieldState.invalid}
                  className="mt-1 size-[18px] shrink-0 rounded border-[#e5e7eb] bg-white accent-ma-text"
                />
                <label htmlFor={field.name} className="text-base leading-normal text-[#6b7280]">
                  By submitting this form, you confirm the accuracy of the donation
                  amount and authorize the payment processing via the checkout page.
                </label>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="group relative h-[53px] w-full overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
          >
            <span className="relative z-10 inline-flex items-center gap-2.5">
              {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
              Donate Now
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                aria-hidden="true"
              />
            </span>
            <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Button>
        </form>
      </div>
    </section>
  )
}
