import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative mx-auto my-20 max-w-[70rem] overflow-hidden rounded-3xl bg-ma-text px-6 py-20 sm:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl">
          Ready to Invest in Your Growth?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          Join a community of learners committed to building valuable skills and
          achieving meaningful results.
        </p>
        <Button className="mt-8 h-12 rounded-full bg-white px-8 text-sm font-semibold text-ma-text shadow-none hover:bg-white/90">
          Start Learning Today
          <ArrowRight
            className="size-4"
            data-icon="inline-end"
            aria-hidden="true"
          />
        </Button>
      </div>
    </section>
  )
}
