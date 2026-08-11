import React from "react"
import DonationForm from "./donation-form"

const InvestInHopeSection = () => {
  return (
    <section className="bg-[#ECE8FF] text-ma-text">
      <div className="marketing-container grid items-center gap-10 sm:gap-25 lg:grid-cols-2">
        <div>
          <h1 className="marketing-header mb-7.5 text-4xl font-bold sm:text-[3.5rem]">
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
