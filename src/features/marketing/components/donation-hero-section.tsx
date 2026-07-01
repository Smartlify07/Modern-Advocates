import Image from "next/image"

export function DonationHeroSection() {
  return (
    <section
      id="donation"
      className="bg-white pt-18 pb-20 text-ma-text sm:pt-25 sm:pb-25"
    >
      <div className="mx-auto max-w-360 px-4 lg:px-25 2xl:px-50">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-base leading-normal font-medium tracking-[10%] text-[#6B7280] uppercase">
            Donation
          </p>

          <h1 className="mt-7.5 font-sans text-[28px]/[100%] leading-[1.16] font-extrabold text-balance text-primary sm:leading-[70px] lg:text-[60px]/[70px] lg:tracking-[-5%]">
            Your Support Keeps Someone in the Game
          </h1>

          <p className="mt-10 text-lg leading-normal text-ma-text">
            When AI changes the rules, not everyone gets the manual.
            ModernAdvocates Inc. makes sure the people who need it most
            don&apos;t get left behind.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <div className="relative min-h-[424px] overflow-hidden rounded-[24px] bg-ma-bg lg:min-h-[420px]">
            <Image
              src="/figma-about/founder.png"
              alt="Melanie Reyes, founder of ModernAdvocates Inc."
              fill
              priority
              sizes="(min-width: 1024px) 510px, calc(100vw - 48px)"
              className="object-cover object-[center_42%]"
            />
          </div>

          <article className="flex flex-col rounded-[24px] bg-[#f5f5f5] p-7.5 sm:p-[30px] lg:min-h-[550px] lg:p-7">
            <div>
              <h2 className="text-[30px] leading-normal font-semibold text-ma-text sm:text-4xl lg:text-[32px]">
                Melanie Reyes
              </h2>
              <p className="text-base leading-normal text-black">Founder</p>
            </div>

            <div className="mt-[31px] space-y-5 text-base leading-normal text-ma-text sm:text-lg">
              <p>
                I built this organization because I lived the gap it&apos;s
                filling. Every dollar you give goes directly to someone
                navigating what I once navigated alone.
              </p>
              <p>
                Interested in partnering, granting, or investing? Reach out
                here.
              </p>
              <p>
                ModernAdvocates Inc. is a 501(c)(3) nonprofit organization. EIN:
                [insert]. All donations are tax-deductible to the full extent
                permitted by law.
              </p>
              <p>
                <strong>Melanie Reyes,</strong>
                <br />
                Founder
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
