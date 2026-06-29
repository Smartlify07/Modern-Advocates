import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="px-4 xl:px-25 2xl:px-50">
      <section className="relative mx-auto my-5 flex min-h-[450px] w-full flex-col items-center justify-center overflow-hidden rounded-[24px] bg-ma-text px-6 text-center lg:my-20">
        <div className="mx-auto max-w-[650px]">
          <h2 className="mx-auto max-w-[600px] font-sans text-[28px]/[40px] font-extrabold tracking-[0%] text-white lg:text-[40px]/[60px]">
            Your Next Chapter Starts With the Right Support
          </h2>
          <p className="mt-6 text-base leading-normal text-white lg:mt-10 lg:text-lg">
            Get access to the guidance, AI workforce training, and healthcare
            resources you need to move forward with confidence.
          </p>

          <div className="mt-12.5 flex flex-col items-center justify-center gap-5 sm:flex-row lg:mt-13">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 rounded-[60px] bg-[linear-gradient(90deg,#4f7cf7_0%,#7b5cff_68.269%)] px-5 py-4 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Book a free consultation
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </section>
  )
}
