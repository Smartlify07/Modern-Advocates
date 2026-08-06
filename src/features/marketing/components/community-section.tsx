import React from "react"

const CommunitySection = () => {
  return (
    <section className="">
      <div className="mx-auto flex items-center gap-25 px-4 py-12.5 sm:py-25 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <div className="h-[560px] w-[650px] rounded-2xl bg-muted"></div>

        <div className="flex max-w-[430px] flex-col gap-17.5">
          <h1 className="text-5xl font-bold text-primary">
            Be part of our community
          </h1>
          <p className="text-xl font-medium text-primary">
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
