import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function DonationCtaSection() {
  return (
    <section className="mx-auto max-w-360 px-4 xl:px-25 2xl:px-50">
      <div className="relative mx-auto my-5 flex min-h-[450px] w-full flex-col items-center justify-center overflow-hidden rounded-[24px] bg-ma-text px-6 text-center lg:my-20">
        <div className="mx-auto">
          <h2 className="mx-auto font-sans text-[28px]/[40px] font-extrabold tracking-[0%] text-white lg:text-[40px]/[60px]">
            Make impact that genuinely matters
          </h2>
          <p className="mx-auto mt-6 max-w-[650px] text-base leading-normal text-white lg:mt-10 lg:text-lg">
            Together, we can make a real impact in communities around the world.
            Help us bring hope and support.
          </p>

          <div className="mt-12.5 flex flex-col items-center justify-center gap-5 sm:flex-row lg:mt-13">
            <Link
              href="/donation"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-[60px] bg-white px-5 py-4 text-center text-base font-semibold text-primary"
            >
              <span className="relative z-10 inline-flex items-center gap-2.5 transition-colors duration-300 group-hover:text-white">
                Donate now
                <ArrowRight
                  className="size-5 transition-all duration-300 group-hover:rotate-[-30deg] group-hover:text-white"
                  aria-hidden="true"
                />
              </span>
              <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
