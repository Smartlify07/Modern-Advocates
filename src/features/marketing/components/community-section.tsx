import Image from "next/image"
import React from "react"

const CommunitySection = () => {
  return (
    <section className="">
      <div className="mx-auto flex flex-col-reverse items-center gap-12 px-4 py-12.5 sm:flex-row sm:gap-25 sm:py-25 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <Image
          src="/figma-home/community.png"
          alt="People putting hands together"
          width={505}
          height={560}
          sizes="(min-width: 640px) 505px, calc(100vw - 32px)"
          className="object-cover"
          quality={100}
        />
        <div className="flex flex-col gap-8 sm:max-w-[430px] sm:gap-17.5">
          <h1 className="text-2xl font-bold text-primary sm:text-5xl">
            Be part of our community
          </h1>
          <p className="text-base font-medium text-primary sm:text-xl">
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
