const steps = [
  {
    number: "01",
    title: "Choose a Course",
    description:
      "Browse our carefully curated programs and select the one that fits your goals.",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  },
  {
    number: "02",
    title: "Learn at Your Pace",
    description:
      "Access lessons, resources, and assignments whenever it suits you.",
    image:
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=800&q=80",
  },
  {
    number: "03",
    title: "Apply Your Skills",
    description:
      "Put your knowledge into action and achieve real results in your career or business.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-ma-bg py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-ma-text sm:text-5xl">
            Start Learning in Three Simple Steps
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="group relative overflow-hidden rounded-2xl bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={step.image}
                  alt=""
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-7">
                <span className="font-heading text-4xl leading-none font-bold text-ma-text/10">
                  {step.number}
                </span>
                <h3 className="mt-2 text-lg font-bold text-ma-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ma-text/60">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
