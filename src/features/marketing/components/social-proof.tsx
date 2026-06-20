import { Check } from "lucide-react"

const features = [
  "Expert-led curriculum",
  "Practical projects and exercises",
  "Flexible learning experience",
  "Certificates of completion",
  "Ongoing support and resources",
]

export function SocialProof() {
  return (
    <section className="bg-ma-bg py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-ma-text sm:text-5xl">
              Thousands of Learners. Real Results.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ma-text/60">
              Our courses are built to bridge the gap between theory and
              real-world application. Whether you&apos;re advancing your
              career, growing a business, or developing new expertise, we
              provide the knowledge and guidance to help you succeed.
            </p>
          </div>
          <div>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ma-text/10">
                    <Check className="size-3 text-ma-text" />
                  </span>
                  <span className="text-sm font-medium text-ma-text/70">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
