import { GradientButton } from "@/shared/ui/gradient-button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section>
      <div className="marketing-container">
        <section className="relative mx-auto my-5 flex min-h-[450px] w-full flex-col items-center justify-center overflow-hidden rounded-card-2 bg-ma-text px-6 text-center">
          <div className="mx-auto max-w-[650px]">
            <h2 className="marketing-header marketing-headline mx-auto max-w-[600px] text-[28px]/[40px]! font-extrabold tracking-[0%] text-white! lg:text-[40px]/[60px]!">
              Help Someone Find Their Way Forward{" "}
            </h2>
            <p className="mt-6 text-base leading-normal text-white lg:mt-10 lg:text-lg">
              Your generosity doesn’t simply fund programs. It helps someone
              regain confidence, develop new skills, navigate healthcare, build
              financial stability, and believe that a better future is possible.
            </p>

            <div className="mt-12.5 flex flex-col items-center justify-center gap-5 sm:flex-row lg:mt-13">
              <GradientButton className="h-15 w-[258px] px-5 text-base">
                Book a free consultation{" "}
                <ArrowRight className="relative z-10 size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
              </GradientButton>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
