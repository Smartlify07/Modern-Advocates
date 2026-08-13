import Image from "next/image"
import React from "react"

const CommunitySection = () => {
  return (
    <section className="">
      <div className="marketing-container flex flex-col-reverse items-center gap-12 md:flex-row lg:gap-12.5 xl:gap-25">
        <Image
          src="/figma-home/community.png"
          alt="People putting hands together"
          width={600}
          height={560}
          className="w-full object-cover lg:h-[410px] lg:w-[450px] xl:h-[560px] xl:w-[600px]"
          quality={100}
        />
        <div className="flex flex-col gap-8 xl:max-w-[490px] xl:gap-17.5">
          <h1 className="marketing-header marketing-headline">
            Be part of our community
          </h1>
          <p className="text-base font-medium text-primary md:text-xl">
            Modern Advocates helps people affected by chronic illness,
            disability, and financial hardship rebuild confidence through AI
            education, and health advocacy.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection
