import Image from "next/image"

export function DonationHeroSection() {
  return (
    <section id="donation" className="bg-white py-12.5 text-ma-text lg:py-25">
      <div className="mx-auto px-4 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-base leading-normal font-medium tracking-[10%] text-muted-foreground uppercase">
            Donation
          </p>

          <h1 className="mt-5 font-sans text-[28px]/[100%] leading-[1.16] font-extrabold text-balance text-primary sm:leading-[70px] lg:mt-7.5 lg:text-[60px]/[70px] lg:tracking-tight-xl">
            Changing Lives Through Education, Advocacy & Hope{" "}
          </h1>

          <p className="mt-5 text-base leading-normal text-ma-text sm:mt-10 sm:text-lg">
            Modern Advocates equips people facing life’s unexpected challenges
            with the knowledge, technology, and support needed to move forward
            with confidence.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <Image
            src="/figma-home/melanie-and-will.png"
            alt="Melanie Reyes, founder of ModernAdvocates Inc."
            priority
            className="rounded-card-2 object-cover sm:h-full"
            width={510}
            height={560}
          />

          <article className="flex flex-col rounded-card-2 bg-ma-surface-2 px-4 py-7.5 lg:min-h-[550px] lg:p-7">
            <div>
              <h2 className="text-3xl leading-normal font-semibold text-ma-text sm:text-4xl">
                Melanie And Will
              </h2>
              <p className="text-base leading-normal">Founders</p>
            </div>

            <div className="mt-[31px] space-y-5 text-base leading-normal text-ma-text sm:text-lg">
              <p>
                We know what it’s like when illness changes everything.
                <br /> <br /> Our journey with endometriosis affected nearly
                every part of our lives—our health, careers, finances,
                relationships, and future. Along the way, Jehovah answered our
                prayers through the kindness and generosity of others. <br />{" "}
                <br /> Modern Advocates was created to extend that same hope.{" "}
                <br /> <br />
                Today, we help people facing chronic illness, disability, and
                financial hardship discover practical pathways forward through
                education, AI, health advocacy, and community support. <br />
                <br />
                ModernAdvocates Inc. is a 501(c)(3) nonprofit organization. EIN:
                42-3785190. All donations are tax-deductible to the full extent
                permitted by law.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
