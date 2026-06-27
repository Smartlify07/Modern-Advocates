import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

const supporters = [
  "/figma-home/person-1.png",
  "/figma-home/person-2.png",
  "/figma-home/person-3.png",
  "/figma-home/person-4.png",
]

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white text-ma-text">
      <div className="relative z-10 mx-auto flex min-h-[924px] max-w-6xl flex-col items-center px-6 py-[118px] text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {supporters.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full border-2 border-white object-cover"
                style={{ zIndex: supporters.length - index }}
              />
            ))}
          </div>
          <div className="flex w-36 flex-col items-start gap-0.5">
            <div className="flex w-full items-center gap-[9px]">
              <div className="flex gap-0 text-[#ff9d00]" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-5 fill-current" />
                ))}
              </div>
              <strong className="text-sm leading-normal font-semibold text-black">
                4.9/5
              </strong>
            </div>
            <p className="w-full text-left text-sm leading-normal text-black">
              5k+ people supported
            </p>
          </div>
        </div>

        <h1 className="mt-[30px] max-w-[800px] font-heading text-[clamp(3rem,5vw,60px)] leading-[70px] font-extrabold text-balance">
          Navigate today&apos;s world with the skills, resources, and support
          you deserve.
        </h1>

        <p className="mt-10 max-w-[750px] text-base leading-normal text-ma-text">
          ModernAdvocates Inc. helps low-to-moderate income individuals access
          AI workforce training and healthcare resources - so a diagnosis or a
          job displacement does not define your future.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white transition-colors hover:bg-ma-text/90"
          >
            Book consultation
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href="/donation"
            className="inline-flex items-center justify-center gap-2.5 rounded-[60px] bg-white px-5 py-4 text-base font-semibold text-ma-text transition-colors hover:bg-ma-bg"
          >
            Support our mission
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-[100px] w-full max-w-[700px]">
          <div
            className="ma-hero-glow pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[780px] w-[954px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
            aria-hidden="true"
          />
          <div className="relative h-[560px] overflow-hidden rounded-[20px] bg-ma-bg">
            <Image
              src="/figma-home/hero.jpg"
              alt="Two students smiling in a city setting"
              fill
              priority
              sizes="(min-width: 768px) 700px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
