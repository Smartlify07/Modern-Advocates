"use client"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { Field } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { cn } from "@/shared/utils"
import { ArrowRight } from "lucide-react"
import React, { useState } from "react"

const prices: { id: number; amount: number }[] = [
  {
    id: 1,
    amount: 10,
  },
  {
    id: 2,
    amount: 20,
  },
  {
    id: 3,
    amount: 30,
  },
  {
    id: 4,
    amount: 40,
  },
]

type DonationType = { label: string; value: string }
const donationTypes = [
  { label: "One time Donation", value: "one time" },
  { label: "Monthly Donation", value: "monthly_donation" },
  { label: "Fixed Donation", value: "fixed_donation" },
]

const DonationForm = () => {
  const [selectedPrice, setSelectedPrice] = useState<null | number>(null)
  const [selectedDonationType, setSelectedDonationType] =
    useState<DonationType["value"]>("one_time")
  return (
    <div className="flex flex-col gap-7.5 rounded-xl bg-white px-7.5 py-10">
      <div>
        <h1 className="mb-5 text-lg font-semibold sm:text-2xl">
          Make a Donation
        </h1>
        <p className="text-base">
          Help us bring hope. support, and real impact in communities
        </p>
      </div>

      <div className="5 flex flex-col gap-7.5 border-b pb-7.5">
        <div className="grid grid-cols-5 items-center gap-3">
          {prices.map((price) => (
            <button
              className={cn(
                "rounded-md px-5 py-2.5 text-base font-medium",
                selectedPrice === price.amount
                  ? "bg-ma-admin-primary text-white"
                  : "bg-ma-bg text-primary"
              )}
              key={price.id}
            >
              ${price.amount}
            </button>
          ))}

          <Input
            type="number"
            name="custom-amount"
            id="custom-amount"
            className="h-auto w-full appearance-none rounded-md border-none bg-ma-bg px-5 py-2.5 text-primary ring-0 placeholder:text-xs placeholder:text-muted-foreground"
            placeholder="Enter amount"
            min={1}
          />
        </div>

        <Field className="flex flex-col gap-2">
          <Label>Frequency</Label>
          <Select defaultValue={donationTypes[0].value}>
            <SelectTrigger className="w-full rounded-md bg-ma-bg data-[size=default]:h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              <SelectGroup>
                {donationTypes.map((item) => (
                  <SelectItem
                    className="px-4 py-2"
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

        <Field orientation="horizontal">
          <Checkbox
            className="data-checked:border-ma-admin-primary data-checked:bg-ma-admin-primary"
            id="authorize-checkbox"
            name="authorize-checkbox"
          />
          <Label htmlFor="authorize-checkbox">
            Authorize payment processing at the checkout page{" "}
          </Label>
        </Field>
      </div>

      <div className="flex items-center justify-between">
        <span>3% Administration fee</span>
        <span>$0.6</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Total </span>
        <span>$300</span>
      </div>

      <Button className="h-[51px] rounded-[60px] bg-ma-admin-primary hover:bg-ma-admin-primary-dark">
        Donate Now <ArrowRight />
      </Button>
    </div>
  )
}

export default DonationForm
