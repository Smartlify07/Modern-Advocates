const cards = [
  {
    title: "Learn From Experts",
    description:
      "Gain insights from experienced professionals who have achieved success in their fields.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    span: "lg:col-span-2 lg:row-span-2",
    height: "lg:h-full",
  },
  {
    title: "Practical & Actionable",
    description:
      "Every lesson focuses on skills and strategies you can apply immediately.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    span: "lg:col-span-1 lg:row-span-1",
    height: "lg:h-full",
  },
  {
    title: "Learn at Your Own Pace",
    description:
      "Access courses anytime, anywhere, and progress on your schedule.",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    span: "lg:col-span-1 lg:row-span-1",
    height: "lg:h-full",
  },
  {
    title: "Results-Focused Education",
    description:
      "We prioritize outcomes, helping you build confidence and achieve measurable growth.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    span: "lg:col-span-3 lg:row-span-1",
    height: "lg:h-72",
  },
]

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-ma-text sm:text-5xl">
          Learning Designed for Real-World Success
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group relative overflow-hidden rounded-2xl ${card.span} ${card.height} min-h-[18rem]`}
            >
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
              <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
