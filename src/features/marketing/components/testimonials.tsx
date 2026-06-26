"use client"

import Image from "next/image"
import { useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

const reviews = [
  {
    image: "/figma/reviews/testimonial-1.png",
    name: "Michael R.",
  },
  {
    image: "/figma/reviews/testimonial-2.png",
    name: "Michael R.",
  },
  {
    image: "/figma/reviews/testimonial-3.png",
    name: "Michael R.",
  },
  {
    image: "/figma/reviews/testimonial-4.png",
    name: "Michael R.",
  },
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollReviews(direction: "previous" | "next") {
    scrollRef.current?.scrollBy({
      left: direction === "next" ? 360 : -360,
      behavior: "smooth",
    })
  }

  return (
    <section className="overflow-hidden bg-white py-[100px]">
      <div className="mx-auto flex max-w-[1044px] flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-[40px] leading-[60px] font-extrabold text-black">
            What they say about us?
          </h2>
          <p className="mt-6 max-w-[650px] text-[18px] leading-normal text-black">
            Real stories from customers who have experienced measurable results
            and meaningful progress with our support.
          </p>
        </div>

        <div className="flex gap-[18px] sm:pb-2">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => scrollReviews("previous")}
            className="flex size-[50px] items-center justify-center rounded-2xl bg-[#f5f5f5] text-black transition-colors hover:bg-[#ececec]"
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => scrollReviews("next")}
            className="flex size-[50px] items-center justify-center rounded-2xl bg-[#f5f5f5] text-black transition-colors hover:bg-[#ececec]"
          >
            <ArrowRight className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar mt-[86px] flex gap-[30px] overflow-x-auto scroll-smooth px-6 pb-2 lg:pl-[calc((100vw_-_1044px)/2)]"
      >
        {reviews.map((review) => (
          <article
            key={review.image}
            className="relative flex h-[500px] w-[330px] shrink-0 flex-col justify-end overflow-hidden rounded-3xl px-[15px] pb-[30px]"
          >
            <Image
              src={review.image}
              alt=""
              fill
              sizes="330px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent from-[30%] to-black"
              aria-hidden="true"
            />

            <div className="relative z-10 h-[166px] w-[300px] text-white">
              <p className="font-heading text-[100px] leading-[60px] font-extrabold">
                &ldquo;
              </p>
              <p className="mt-[-14px] text-[18px] leading-normal font-semibold">
                ModernAdvocates helped me see a clear path forward. The guidance
                and training resources gave
              </p>
              <p className="mt-5 text-[18px] leading-normal font-semibold">
                -{review.name}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
