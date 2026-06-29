import Image from "next/image"

const ecosystemItems = [
  "A platform that supports real-world health navigation",
  "Training programs that teach people how to use AI safely and effectively",
  "A feedback system that continuously improves outcomes",
]

export function AboutAiHealthcareSection() {
  return (
    <section className="bg-white py-20 text-ma-text sm:py-25">
      <div className="mx-auto grid items-start gap-10 lg:grid-cols-[422px_1fr] lg:gap-[50px] lg:px-25 2xl:px-50">
        <div className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-ma-bg sm:min-h-[500px]">
          <Image
            src="/figma-about/healthcare-ai.png"
            alt="A gloved hand operating medical equipment"
            fill
            sizes="(min-width: 1024px) 422px, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>

        <div className="pt-0 lg:pt-1">
          <h2 className="max-w-[578px] font-sans text-[clamp(2.25rem,4vw,40px)] leading-[1.25] font-extrabold text-balance text-ma-text sm:leading-[60px]">
            ModernAdvocates is redefining how AI is used in Healthcare
          </h2>

          <div className="mt-8 max-w-[578px] space-y-5 text-base leading-normal text-ma-text sm:mt-[30px] sm:text-lg">
            <p>
              Most organizations operate in silos-technology, education, or care
              delivery. ModernAdvocates brings these elements together into one
              ecosystem:
            </p>

            <ul className="list-disc space-y-1 pl-7">
              {ecosystemItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p>
              This integration allows us to move beyond theory and deliver
              practical, scalable impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
