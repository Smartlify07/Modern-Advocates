import React from "react"

const PracticalPathwaysSection = () => {
  return (
    <section className="bg-[#111827]">
      <div className="mx-auto items-center gap-25 px-4 py-12.5 text-white sm:py-25 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <div className="mx-auto mb-20 self-center">
          <h1 className="mx-auto mb-7.5 max-w-[850px] text-center text-3xl font-bold lg:text-[3.5rem]">
            Practical pathways to improved health outcomes
          </h1>
          <p className="text-center text-xl font-medium">Our shared values</p>
        </div>

        <div className="flex items-center gap-25">
          <div className="max-w-[400px]">
            <h1 className="mb-7.5 text-5xl font-bold text-white">
              Restoring Hope
            </h1>
            <p className="text-xl">
              We believe every person deserves hope, dignity, and the
              opportunity to move forward, regardless of disability, chronic
              illness, or financial hardship.
            </p>
          </div>

          <div className="h-[560px] w-[505px] bg-muted"></div>
        </div>
      </div>
    </section>
  )
}

export default PracticalPathwaysSection
