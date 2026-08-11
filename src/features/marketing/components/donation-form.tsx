"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { apiFetch } from "@/shared/lib/api-fetch"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { cn } from "@/shared/utils"
import {
  computeAdminFee,
  computeDonationTotal,
} from "@/features/marketing/lib/donation-pricing"
import { GradientButton } from "@/shared/ui/gradient-button"

const prices = [
  { id: 1, amount: 10 },
  { id: 2, amount: 20 },
  { id: 3, amount: 30 },
  { id: 4, amount: 40 },
]

const donationTypeOptions = [
  { label: "One-Time Donation", value: "fixed" },
  { label: "Monthly Donation", value: "monthly" },
] as const

const donationFormSchema = z.object({
  donationType: z.enum(["fixed", "monthly"]),
  amount: z
    .number({ message: "Enter a donation amount" })
    .positive("Amount must be greater than 0"),
  donorName: z.string().min(1, "Full name is required"),
  donorEmail: z.email("Please enter a valid email address"),
  confirmation: z.boolean(),
})

type DonationFormValues = z.infer<typeof donationFormSchema>

const DonationForm = () => {
  const [submitting, setSubmitting] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donationType: "fixed",
      amount: prices[1].amount,
      donorName: "",
      donorEmail: "",
      confirmation: false,
    },
  })

  const watchedAmount = useWatch({ control: form.control, name: "amount" })
  const isConfirmed = useWatch({ control: form.control, name: "confirmation" })

  const hasCustomAmount = customAmount.trim() !== ""
  const parsedCustomAmount = Number(customAmount)
  const effectiveAmount = hasCustomAmount ? parsedCustomAmount : watchedAmount

  const fee = computeAdminFee(effectiveAmount)
  const total = computeDonationTotal(effectiveAmount)

  async function onSubmit(data: DonationFormValues) {
    if (
      hasCustomAmount &&
      (!Number.isFinite(parsedCustomAmount) || parsedCustomAmount <= 0)
    ) {
      toast.error("Enter a valid donation amount")
      return
    }

    setSubmitting(true)
    try {
      const result = await apiFetch<{ url: string }>("/api/donations", {
        method: "POST",
        body: {
          amount: hasCustomAmount ? parsedCustomAmount : data.amount,
          donorName: data.donorName,
          donorEmail: data.donorEmail,
          donationType: data.donationType,
        },
      })

      window.location.assign(result.url)
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
    <div className="flex flex-col gap-7.5 bg-white px-4 py-10 shadow-[0_-6px_40px_0_rgba(0,0,0,0.08)] sm:px-7.5">
      <div>
        <h1 className="marketing-header mb-5 text-lg font-semibold sm:text-2xl">
          Make a Donation
        </h1>
        <p className="text-base">
          Help us bring hope. support, and real impact in communities
        </p>
      </div>

      <form
        id="donation-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7.5"
      >
        <FieldGroup className="gap-7.5">
          <Controller
            control={form.control}
            name="amount"
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="donation-amount">
                  Donation amount
                </FieldLabel>
                <div className="grid grid-cols-3 items-center gap-3 sm:grid-cols-5">
                  {prices.map((price) => (
                    <button
                      type="button"
                      key={price.id}
                      onClick={() => {
                        form.setValue("amount", price.amount, {
                          shouldValidate: true,
                        })
                        setCustomAmount("")
                      }}
                      className={cn(
                        "rounded-none px-5 py-2.5 text-base font-medium transition-colors",
                        !hasCustomAmount && watchedAmount === price.amount
                          ? "bg-ma-admin-primary text-white"
                          : "bg-ma-bg text-primary"
                      )}
                    >
                      ${price.amount}
                    </button>
                  ))}

                  <Input
                    id="donation-amount"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="col-span-2 h-auto rounded-none border-none bg-ma-bg px-5 py-2.5 text-primary ring-0 [-moz-appearance:textfield] placeholder:text-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ma-admin-primary sm:col-span-1 sm:w-full"
                    placeholder="Enter amount"
                  />
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="donationType"
            render={({ field }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel>Frequency</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full rounded-none bg-ma-bg data-[size=default]:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectGroup>
                      {donationTypeOptions.map((item) => (
                        <SelectItem
                          className="rounded-none px-4 py-2"
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="donorName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="donor-name">Full name</FieldLabel>
                <Input
                  {...field}
                  id="donor-name"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="h-11 rounded-none bg-ma-bg px-5 text-base placeholder:text-muted-foreground"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="donorEmail"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="donor-email">Email address</FieldLabel>
                <Input
                  {...field}
                  id="donor-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-none bg-ma-bg px-5 text-base placeholder:text-muted-foreground"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="confirmation"
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="donation-confirmation"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="data-checked:border-ma-admin-primary data-checked:bg-ma-admin-primary"
                />
                <FieldLabel htmlFor="donation-confirmation" className="w-fit">
                  Authorize payment processing at the checkout page
                </FieldLabel>
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="flex flex-col gap-7.5 border-t pt-7.5">
        <div className="flex items-center justify-between">
          <span>3% Administration fee</span>
          <span>${fee.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <GradientButton className="h-[51px]">
        {submitting && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        Donate Now
        <ArrowRight className="relative z-10 size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />{" "}
      </GradientButton>
    </div>
  )
}

export default DonationForm
