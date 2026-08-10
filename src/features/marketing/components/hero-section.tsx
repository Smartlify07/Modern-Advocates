import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fefafd] text-ma-text">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/figma-home/hero-life-direction.png"
          alt="A woman sitting and gazing at the sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[72%_center]"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fefafd] via-[#fefafd]/60 to-[#fefafd] lg:bg-gradient-to-r lg:from-[#fefafd] lg:from-[0%] lg:via-[#fefafd]/80 lg:via-[16%] lg:to-transparent lg:to-[38%]" />
      </div>

      <div className="marketing-container relative z-10 flex min-h-[680px] max-w-360 items-center px-5 pt-14 pb-12 sm:px-8 lg:min-h-[924px]">
        <div className="text-center lg:text-left xl:max-w-[640px] 2xl:max-w-[709px]">
          <h1 className="font-sans text-[38px]/[1.08] font-bold tracking-[-5%] text-balance text-ma-text sm:text-[52px]/[1.08] lg:text-[70px]/[1.08]">
            When Life Takes an Unexpected Direction,
            <br /> You Don&apos;t Have to Face It Alone.
          </h1>

          <p className="mx-auto mt-7 max-w-[597px] text-base leading-7 text-ma-text sm:text-lg lg:mx-0 lg:mt-12 lg:text-xl lg:leading-8">
            Modern Advocates empowers people facing chronic illness, disability,
            and financial hardship with education, advocacy, AI skills, and
            practical opportunities to rebuild hope and independence.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-20 lg:justify-start lg:gap-5">
            <Link
              href="/signup"
              className="group inline-flex h-[54px] items-center justify-center gap-2.5 rounded-pill bg-ma-admin-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-ma-admin-primary-dark sm:text-base"
            >
              Start your journey
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/about"
              className="group inline-flex h-[54px] items-center justify-center gap-2.5 rounded-pill border border-ma-admin-primary bg-white px-5 text-sm font-semibold text-ma-admin-primary transition-colors hover:bg-ma-bg sm:text-base"
            >
              Learn our story
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
