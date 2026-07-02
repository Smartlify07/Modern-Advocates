"use client"
import { motion } from "motion/react"
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
    <section className="relative isolate bg-white text-ma-text">
      <div className="relative z-10 mx-auto flex max-w-360 flex-col items-center px-4 py-12.5 text-center lg:min-h-[924px] lg:py-[118px] xl:px-25 2xl:px-50">
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

        <h1 className="mt-[30px] max-w-[800px] font-sans text-[26px]/[100%] font-extrabold lg:text-[60px] lg:leading-[70px] lg:tracking-[-5%]">
          Navigate today&apos;s world with the skills, resources, and support
          you deserve.
        </h1>

        <p className="mt-6 max-w-[750px] text-ma-text lg:mt-10 lg:text-base/[100%]">
          ModernAdvocates Inc. helps low-to-moderate income individuals access
          AI workforce training and healthcare resources - so a diagnosis or a
          job displacement does not define your future.
        </p>

        <div className="mt-10 flex items-center gap-5">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-[60px] bg-ma-text px-5 py-4 sm:gap-2.5 sm:text-base"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-nowrap text-white sm:gap-2.5 sm:text-base">
              Book consultation
              <ArrowRight
                className="hidden size-5 transition-transform duration-300 group-hover:-rotate-30 md:inline"
                aria-hidden="true"
              />
            </span>
            <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
          <Link
            href="/donation"
            className="group inline-flex items-center justify-center gap-1.5 rounded-[60px] bg-white px-5 py-4 text-xs font-semibold text-nowrap text-ma-text transition-colors hover:bg-ma-bg sm:gap-2.5 sm:text-base"
          >
            Support our mission
            <ArrowRight
              className="hidden size-5 transition-transform duration-300 group-hover:-rotate-30 md:inline"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="relative mt-15 w-full lg:mt-[100px]">
          <div
            className="ma-hero-glow pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 lg:top-1/3 lg:left-1/2 lg:h-[950px] lg:w-[954px]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ scale: 700 / 1024 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            // viewport={{ once: true }}
          >
            <div className="relative h-[280px] overflow-hidden rounded-[20px] bg-ma-bg lg:h-[560px]">
              <Image
                src="/figma-home/hero.jpg"
                alt="Two students smiling in a city setting"
                fill
                priority
                sizes="(min-width: 768px) 700px, calc(100vw - 0px)"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
