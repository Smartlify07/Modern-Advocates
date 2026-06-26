import Image from "next/image"
import { Star } from "lucide-react"

const supporters = [
  "/figma-about/supporter-1.png",
  "/figma-about/supporter-2.png",
  "/figma-about/supporter-3.png",
  "/figma-about/supporter-4.png",
]

export function AboutHeroSection() {
  return (
    <section className="bg-white px-6 pt-18 pb-20 text-ma-text sm:pt-24 sm:pb-25">
      <div className="mx-auto max-w-[1040px]">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-base leading-normal font-medium tracking-[0.1em] text-[#6b7280] uppercase">
            About us
          </p>

          <h1 className="mt-[30px] font-heading text-[clamp(2.75rem,6vw,60px)] leading-[1.16] font-extrabold text-balance text-black sm:leading-[70px]">
            This Organization Exists Now Because It Didn&apos;t When I Needed
            It.
          </h1>

          <div className="mt-[46px] flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
            <div className="flex -space-x-3">
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
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden rounded-[24px] bg-ma-bg sm:min-h-[550px]">
            <Image
              src="/figma-about/founder.png"
              alt="Melanie Reyes, founder of ModernAdvocates Inc."
              fill
              priority
              sizes="(min-width: 1024px) 510px, calc(100vw - 48px)"
              className="object-cover"
            />
          </div>

          <article className="flex min-h-[550px] flex-col rounded-[24px] bg-[#f5f5f5] p-7 sm:p-[30px]">
            <div>
              <h2 className="text-[32px] leading-normal font-semibold text-ma-text sm:text-4xl">
                Melanie Reyes
              </h2>
              <p className="text-base leading-normal text-black">Founder</p>
            </div>

            <div className="mt-[31px] space-y-5 text-base leading-normal text-ma-text sm:text-lg">
              <p>
                I built ModernAdvocates Inc. out of something I lived - not
                something I studied.
              </p>
              <p>
                Navigating Endometriosis in a healthcare system that kept
                dismissing me taught me that the gap between the help that
                exists and the people who need it most is not a coincidence.
                It&apos;s a design flaw.
              </p>
              <p>
                And as AI began reshaping how we work, how we access care, and
                how we navigate every major system in our lives, I saw that same
                gap widening. So, I built the bridge.
              </p>
              <p>
                A new model of care-one that integrates artificial intelligence,
                clinical insight, and real-world education to improve how
                individuals navigate complex health conditions.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
