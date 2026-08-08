import DonationForm from "./donation-form"

export function DonationSupportSection() {
  return (
    <section className="bg-[#ECE8FF] py-12.5 text-ma-text lg:py-25">
      <div className="mx-auto grid items-center gap-12 px-4 lg:max-w-7xl lg:grid-cols-2 lg:gap-6 lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="pt-0 lg:pt-2">
          <h2 className="font-sans text-3xl leading-[1.12] font-extrabold text-balance text-primary sm:text-5xl sm:tracking-tight-xl">
            Invest in Hope
          </h2>
          <p className="mt-[30px] max-w-[506px] text-base leading-normal text-primary lg:text-lg">
            Your gift helps fund: <br /> <br />
            AI & Digital Skills Education, Health Advocacy, Patient Resource
            Navigation, Workforce Readiness, Chronic Illness Support, and
            Endometriosis Education.
          </p>
        </div>

        <DonationForm />
      </div>
    </section>
  )
}
