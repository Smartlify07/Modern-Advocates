import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="relative mx-auto my-20 flex min-h-[450px] w-full max-w-[1040px] flex-col items-center overflow-hidden rounded-[24px] bg-ma-text px-6 pt-20 text-center">
      <div className="mx-auto max-w-[650px]">
        <h2 className="mx-auto max-w-[600px] font-heading text-[40px] leading-[60px] font-extrabold text-white">
          Your Next Chapter Starts With the Right Support
        </h2>
        <p className="mt-10 text-[18px] leading-normal text-white">
          Get access to the guidance, AI workforce training, and healthcare
          resources you need to move forward with confidence.
        </p>

        <div className="mt-[52px] flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 rounded-[60px] bg-[linear-gradient(90deg,#4f7cf7_0%,#7b5cff_68.269%)] px-5 py-4 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Book a free consultation
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href="#donation"
            className="inline-flex items-center justify-center gap-2.5 rounded-[60px] bg-white px-5 py-4 text-center text-base font-semibold text-ma-text transition-colors hover:bg-white/90"
          >
            Support our mission
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
