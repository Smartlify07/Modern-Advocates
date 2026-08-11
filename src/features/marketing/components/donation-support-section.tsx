import DonationForm from "./donation-form"

export function DonationSupportSection() {
  return (
    <section className="bg-[#ECE8FF] text-ma-text">
      <div className="marketing-container grid items-center gap-12 lg:grid-cols-2 lg:gap-6">
        <div className="pt-0 lg:pt-2">
          <h2 className="marketing-header text-3xl leading-[1.12] font-extrabold text-balance text-primary sm:text-5xl sm:tracking-tight-xl">
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
