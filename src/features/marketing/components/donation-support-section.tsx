import { ArrowRight } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

const donationTypes = ["Fixed Donation", "Tier Donation", "Monthly Pay"]

export function DonationSupportSection() {
  return (
    <section className="bg-white py-20 text-ma-text sm:py-25 lg:px-25 2xl:px-50">
      <div className="mx-auto grid items-start gap-12 lg:grid-cols-[506px_510px] lg:gap-6">
        <div className="pt-0 lg:pt-2">
          <h2 className="font-sans text-[clamp(2.75rem,5.5vw,60px)] leading-[1.12] font-extrabold text-balance text-primary sm:leading-[70px]">
            Support us and make a difference for the future!
          </h2>
          <p className="mt-[30px] max-w-[506px] text-lg leading-normal text-black">
            Together, we can make a real impact in communities around the world.
            Help us bring hope and support.
          </p>
        </div>

        <form className="flex w-full max-w-[510px] flex-col gap-[30px] rounded-[24px] border border-[#d9d9d9] bg-[#f5f5f5] px-7 pt-[30px] pb-7 sm:px-[30px]">
          <div className="border-b border-[#d9d9d9] pb-2.5">
            <h3 className="text-2xl leading-normal font-bold text-black">
              Make Your Donation
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <legend className="text-xl leading-normal font-semibold text-black">
              Type of Donation
            </legend>

            <div className="grid gap-3 sm:grid-cols-3">
              {donationTypes.map((type, index) => (
                <label
                  key={type}
                  className="flex min-w-0 items-start gap-2 text-base leading-normal text-[#6b7280]"
                >
                  <input
                    type="radio"
                    name="donationType"
                    value={type}
                    defaultChecked={index === 0}
                    className="mt-0.5 size-5 shrink-0 accent-[#6d63ff]"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="relative">
            <label htmlFor="donation-amount" className="sr-only">
              Donation amount
            </label>
            <Input
              id="donation-amount"
              name="amount"
              inputMode="decimal"
              placeholder="Enter Amount"
              className="h-10 rounded-[6px] border-[#e5e7eb] bg-white px-4 py-2.5 pr-10 text-base placeholder:text-[#6b7280]"
            />
            <span
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl leading-none font-bold text-ma-text"
              aria-hidden="true"
            >
              $
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl leading-normal font-semibold text-black">
              Personal Info
            </h3>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="donation-name"
                className="text-lg leading-normal text-ma-text"
              >
                Full Name
              </label>
              <Input
                id="donation-name"
                name="name"
                autoComplete="name"
                placeholder="Enter full name"
                className="h-10 rounded-md border-[#e5e7eb] bg-white px-4 py-2.5 text-base placeholder:text-[#6b7280]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="donation-email"
                className="text-lg leading-normal text-ma-text"
              >
                Email
              </label>
              <Input
                id="donation-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter email"
                className="h-10 rounded-md border-[#e5e7eb] bg-white px-4 py-2.5 text-base placeholder:text-[#6b7280]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-base leading-normal text-[#6b7280]">
            <input
              type="checkbox"
              name="donationConfirmation"
              className="mt-1 size-[18px] shrink-0 rounded border-[#e5e7eb] bg-white accent-ma-text"
            />
            <span>
              By submitting this form, you confirm the accuracy of the donation
              amount and authorize the payment processing via the checkout page.
            </span>
          </label>

          <Button
            type="button"
            className="h-[53px] w-full gap-2.5 rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white hover:bg-ma-text/90"
          >
            Donate Now
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </section>
  )
}
