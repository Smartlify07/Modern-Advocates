import { ArrowRight } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export function DonationSupportSection() {
  return (
    <section className="bg-white px-6 py-20 text-ma-text sm:py-25">
      <div className="mx-auto grid max-w-[1040px] items-start gap-12 lg:grid-cols-[506px_1fr] lg:gap-[26px]">
        <div className="pt-0 lg:pt-2">
          <h2 className="max-w-[506px] font-heading text-[clamp(2.75rem,5.5vw,60px)] leading-[1.12] font-extrabold text-balance text-black sm:leading-[70px]">
            Support us and make a difference for the future!
          </h2>
          <p className="mt-[30px] max-w-[506px] text-lg leading-normal text-black">
            Together, we can make a real impact in communities around the world.
            Help us bring hope and support.
          </p>
        </div>

        <form className="min-h-[520px] rounded-[24px] border bg-[#f5f5f5] px-7 pt-[30px] pb-7 sm:px-[30px]">
          <div>
            <h3 className="text-lg leading-normal font-bold text-black">
              Donation Form
            </h3>
            <p className="mt-2 max-w-[446px] text-base leading-normal text-[#6b7280]">
              Please fill out the form below to make a donation. Your
              contribution, big or small, helps us make a real difference.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-5">
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
                className="h-9 rounded-md border-[#e5e7eb] bg-white px-2.5 py-2.5 text-base placeholder:text-[#6b7280]"
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
                className="h-9 rounded-md border-[#e5e7eb] bg-white px-2.5 py-2.5 text-base placeholder:text-[#6b7280]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="donation-amount"
                className="text-lg leading-normal text-ma-text"
              >
                Choose your donation amount
              </label>
              <Input
                id="donation-amount"
                name="amount"
                inputMode="decimal"
                defaultValue="$50.00"
                className="h-9 rounded-md border-[#e5e7eb] bg-white px-2.5 py-2.5 text-xl text-ma-text"
              />
            </div>
          </div>

          <Button
            type="button"
            className="mt-3 h-[53px] w-full gap-2.5 rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white hover:bg-ma-text/90"
          >
            Donate Now
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </section>
  )
}
