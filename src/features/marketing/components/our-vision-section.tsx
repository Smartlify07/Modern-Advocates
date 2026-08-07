import Image from "next/image"

const OurVisionSection = () => {
  return (
    <section className="bg-[#111827]">
      <div className="mx-auto flex flex-col items-center gap-20 px-4 py-12.5 text-white sm:gap-50 sm:py-25 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <div className="mx-auto self-center">
          <h1 className="mx-auto mb-4 max-w-[850px] text-center text-3xl font-bold sm:mb-7.5 lg:text-[3.5rem]">
            Everyone deserves the opportunity to move forward{" "}
          </h1>
          <p className="text-center text-base font-medium sm:text-xl">
            Our vision
          </p>
        </div>

        <div className="mx-auto flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-25">
          <div className="sm:max-w-[400px]">
            <h1 className="mb-4 text-2xl font-bold text-white sm:mb-7.5 sm:text-5xl">
              Our Vision{" "}
            </h1>
            <p className="text-base sm:text-xl">
              We envision communities where illness, disability, or financial
              hardship no longer determines a person’s future. <br />
              <br />
              By promoting education, technology, advocacy, and compassion, we
              combine the efforts of many to help individuals build confidence,
              regain independence, and create new possibilities.
            </p>
          </div>

          <Image
            src="/figma-home/restoring-hope.png"
            alt="Three women smiling together"
            width={505}
            height={560}
            sizes="(min-width: 640px) 505px, calc(100vw - 32px)"
            className="object-cover"
            quality={100}
          />
        </div>
      </div>
    </section>
  )
}

export default OurVisionSection
