import React from "react"
import DonationForm from "./donation-form"

const InvestInHopeSection = () => {
  return (
    <section className="bg-[#ECE8FF] py-12.5 text-ma-text sm:py-25">
      <div className="mx-auto grid grid-cols-2 items-center gap-25 px-4 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <div>
          <h1 className="mb-7.5 text-4xl font-bold sm:text-[3.5rem]">
            Invest in Hope
          </h1>
          <p className="text-base sm:text-xl">
            Your gift helps fund: <br />
            <br /> AI & Digital Skills Education, Health Advocacy, Patient
            Resource Navigation, Workforce Readiness, Chronic Illness Support,
            and Endometriosis Education.
          </p>
        </div>

        <DonationForm />
      </div>
    </section>
  )
}

export default InvestInHopeSection
