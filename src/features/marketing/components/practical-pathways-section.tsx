import Image from "next/image"

const PracticalPathwaysSection = () => {
  return (
    <section className="bg-[#111827]">
      <div className="marketing-container flex flex-col items-center gap-20 text-white sm:gap-50">
        <div className="mx-auto self-center">
          <h1 className="mx-auto mb-4 max-w-[850px] text-center text-3xl font-bold sm:mb-7.5 lg:text-[3.5rem]">
            Practical pathways to improved health outcomes
          </h1>
          <p className="text-center text-base font-medium sm:text-xl">
            Our shared values
          </p>
        </div>

        <div className="mx-auto flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-25">
          <div className="sm:max-w-[400px]">
            <h1 className="mb-4 text-2xl font-bold text-white sm:mb-7.5 sm:text-5xl">
              Restoring Hope
            </h1>
            <p className="text-base sm:text-xl">
              We believe every person deserves hope, dignity, and the
              opportunity to move forward, regardless of disability, chronic
              illness, or financial hardship.
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

export default PracticalPathwaysSection
