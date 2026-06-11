import Image from "next/image"
import { ArrowRight, Menu, Star } from "lucide-react"

import { Button } from "@/components/ui/button"

const navigationItems = [
  "Home",
  "Courses",
  "About",
  "Contact",
  "Donation",
  "Login",
]

const reviewerImages = [
  "/figma-home/person-1.png",
  "/figma-home/person-2.png",
  "/figma-home/person-3.png",
  "/figma-home/person-4.png",
]

function Header() {
  return (
    <header className="relative z-20 bg-ma-card">
      <div className="mx-auto flex h-[100px] w-full max-w-[1040px] items-center justify-between px-5 sm:px-8 xl:px-0">
        <a
          className="flex h-[60px] w-[157px] items-center justify-center"
          href="#"
          aria-label="ModernAdvocates Inc home"
        >
          <span className="flex flex-col items-center gap-1.5">
            <Image
              src="/figma-home/logo.svg"
              alt=""
              width={58}
              height={44}
              className="h-[44px] w-[58px]"
              priority
            />
            <span className="font-sans text-[7px] leading-none font-semibold text-ma-text">
              ModernAdvocates Inc
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-2 lg:flex"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => (
            <a
              className="px-2.5 py-2.5 text-base leading-none text-ma-text transition-colors hover:text-ma-text/70"
              href="#"
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <Button className="hidden h-[52px] w-[157px] rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary/90 md:inline-flex">
          Consultation
          <ArrowRight
            className="size-5"
            data-icon="inline-end"
            aria-hidden="true"
          />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-11 rounded-full border-ma-text/10 bg-ma-card text-ma-text md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </div>
    </header>
  )
}

function ReviewSummary() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative h-10 w-[118px] shrink-0">
        {reviewerImages.map((src, index) => (
          <Image
            src={src}
            alt=""
            width={40}
            height={40}
            className="absolute top-0 size-10 rounded-full object-cover ring-2 ring-ma-card"
            style={{ left: index * 26 }}
            key={src}
          />
        ))}
      </div>

      <div className="w-36">
        <div className="flex items-center gap-[9px]">
          <div
            className="flex w-[100px] items-center gap-0.5 text-amber-400"
            aria-label="Rated 4.9 out of 5 stars"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                className="size-4 fill-current"
                key={index}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-sm leading-none font-semibold text-black">4.9/5</p>
        </div>
        <p className="mt-1 text-center text-sm leading-none text-black">
          5k+ people supported
        </p>
      </div>
    </div>
  )
}

function CtaButtons() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
      <Button className="h-[52px] rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary/90">
        Book a free consultation
        <ArrowRight
          className="size-5"
          data-icon="inline-end"
          aria-hidden="true"
        />
      </Button>
      <Button
        variant="secondary"
        className="h-[52px] rounded-full bg-ma-card px-5 text-base font-semibold text-ma-text shadow-none hover:bg-ma-bg"
      >
        Support our mission
        <ArrowRight
          className="size-5"
          data-icon="inline-end"
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-ma-card text-ma-text">
      <Header />

      <section className="relative min-h-[calc(100svh-100px)] overflow-hidden pb-20 lg:min-h-[924px]">
        <div
          className="ma-hero-glow pointer-events-none absolute top-[330px] left-1/2 h-[620px] w-[min(80vw,954px)] -translate-x-1/2 rounded-full opacity-80 blur-[2px] sm:top-[360px] sm:h-[780px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex max-w-[1040px] flex-col items-center px-5 pt-16 text-center sm:px-8 lg:px-0 lg:pt-[118px]">
          <ReviewSummary />

          <h1 className="mt-[30px] max-w-[800px] text-center font-heading text-[clamp(2.75rem,6.5vw,3.75rem)] leading-[1.08] font-extrabold text-balance text-ma-text sm:leading-[1.12] lg:leading-[70px]">
            Navigate today&apos;s world with the skills, resources, and support
            you deserve.
          </h1>

          <p className="mt-6 max-w-[750px] text-center text-base leading-6 text-ma-text">
            ModernAdvocates Inc. helps low-to-moderate income individuals access
            AI workforce training and healthcare resources - so a diagnosis or a
            job displacement does not define your future.
          </p>

          <div className="mt-8 lg:mt-[34px]">
            <CtaButtons />
          </div>

          <div className="relative mt-20 w-full max-w-[700px] overflow-hidden rounded-[20px] bg-ma-bg shadow-[0_24px_80px_rgba(17,24,39,0.12)] sm:mt-[92px]">
            <Image
              src="/figma-home/hero.jpg"
              alt="Two smiling young women standing together outdoors"
              width={1280}
              height={874}
              className="h-[360px] w-full object-cover object-[58%_38%] sm:h-[560px]"
              priority
            />
          </div>
        </div>
      </section>
    </main>
  )
}
