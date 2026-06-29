import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, Star, Users } from "lucide-react"

import { Button } from "@/shared/ui/button"

export function CourseDetailHeroSection() {
  return (
    <section className="bg-[#f5f5f5] py-16 text-ma-text sm:py-[90px]">
      <div className="mx-auto grid gap-5 rounded-[24px] lg:grid-cols-2 lg:px-25 2xl:px-50">
        <div className="relative min-h-[320px] overflow-hidden rounded-[24px] sm:min-h-[428px]">
          <Image
            src="/figma-courses/foundational-ai-skills.png"
            alt="Desktop computer workspace for Build Foundational AI Skills"
            fill
            priority
            sizes="(min-width: 1024px) 510px, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>

        <div className="flex min-h-[428px] flex-col justify-between px-0 py-2 lg:px-2.5 lg:py-0">
          <div className="flex flex-col gap-5">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-base leading-normal font-medium"
            >
              <Link
                href="/courses"
                className="text-[#6b7280] transition-colors hover:text-ma-text"
              >
                Course
              </Link>
              <ChevronRight className="size-4 text-[#6b7280]" aria-hidden />
              <span className="text-ma-text">Build Foundational AI skills</span>
            </nav>

            <div>
              <h1 className="max-w-[510px] text-[clamp(2.25rem,5vw,40px)] leading-normal font-bold text-ma-text">
                Build Foundational AI Skills
              </h1>
              <p className="mt-5 text-lg leading-normal text-ma-text">
                Mr. Maxwell Anthony
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 lg:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] p-[5px] text-sm leading-normal font-medium text-[#6b7280]">
                <Users className="size-5 text-[#6b7280]" aria-hidden="true" />
                210 Students Enrolled
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] p-[5px] text-sm leading-normal font-medium text-[#6b7280]">
                <Star
                  className="size-5 fill-[#ff9d00] text-[#ff9d00]"
                  aria-hidden="true"
                />
                5.0
              </span>
              <span className="inline-flex items-center rounded-md border border-[#e5e7eb] px-[5px] py-1.5 text-sm leading-normal font-medium text-[#6b7280]">
                100 ratings
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5 leading-normal font-medium">
              <p className="text-2xl text-ma-text">$ 100.00 USD</p>
              <p className="text-base text-[#6b7280] line-through">
                $ 550.00 USD
              </p>
            </div>

            <Link
              href="/contact"
              className="w-fit text-base leading-normal text-ma-text underline underline-offset-2 transition-colors hover:text-ma-text/70"
            >
              Apply for Grant
            </Link>

            <Button
              asChild
              className="mt-3 h-[53px] w-full gap-2.5 rounded-[60px] bg-ma-text px-5 py-4 text-base font-semibold text-white hover:bg-ma-text/90"
            >
              <Link href="/signup">
                Enroll Now
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
