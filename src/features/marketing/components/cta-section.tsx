import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section>
      <div className="marketing-container">
        <section className="relative mx-auto my-5 flex min-h-[450px] w-full flex-col items-center justify-center overflow-hidden rounded-card-2 bg-ma-text px-6 text-center">
          <div className="mx-auto max-w-[650px]">
            <h2 className="mx-auto max-w-[600px] font-sans text-[28px]/[40px] font-extrabold tracking-[0%] text-white md:tracking-tight-xl lg:text-[40px]/[60px]">
              Help Someone Find Their Way Forward{" "}
            </h2>
            <p className="mt-6 text-base leading-normal text-white lg:mt-10 lg:text-lg">
              Your generosity doesn’t simply fund programs. It helps someone
              regain confidence, develop new skills, navigate healthcare, build
              financial stability, and believe that a better future is possible.
            </p>

            <div className="mt-12.5 flex flex-col items-center justify-center gap-5 sm:flex-row lg:mt-13">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2.5 rounded-pill bg-ma-admin-primary px-5 py-4 text-center text-base font-semibold text-white transition-opacity"
              >
                Book a free consultation
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
