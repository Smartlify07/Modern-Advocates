"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isMobile
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  function scrollReviews(direction: "previous" | "next") {
    const el = scrollRef.current
    if (!el) return

    if (!isMobile) {
      el.scrollTo({
        left: direction === "next" ? el.scrollWidth - el.clientWidth : 0,
        behavior: "smooth",
      })
      return
    }

    const cards = el.querySelectorAll<HTMLElement>("article")
    const firstCard = cards[0]
    const secondCard = cards[1]
    const cardStep = secondCard
      ? secondCard.offsetLeft - firstCard.offsetLeft
      : firstCard?.offsetWidth || el.clientWidth
    const currentIndex = Math.round(el.scrollLeft / cardStep)
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    const clampedIndex = Math.max(0, Math.min(nextIndex, cards.length - 1))
    el.scrollTo({ left: clampedIndex * cardStep, behavior: "smooth" })
  }

  return (
    <section className="overflow-hidden bg-white py-12.5 lg:py-25">
      <div className="mx-auto max-w-360 px-4 xl:px-25 2xl:px-50">
        <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-[28px]/[100%] font-extrabold text-primary lg:text-[40px] lg:leading-15">
              What they say about us?
            </h2>
            <p className="mt-6 max-w-[650px] text-[18px] leading-normal text-primary">
              Real stories from customers who have experienced measurable
              results and meaningful progress with our support.
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
      </div>

      <div className="overflow-hidden xl:pl-25 2xl:px-50">
        <div
          ref={scrollRef}
          className="hide-scrollbar relative mt-21.5 flex gap-7.5 overflow-x-auto scroll-smooth pb-2 pr-[max(0px,calc(100%_-_1050px))]"
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
                  ModernAdvocates helped me see a clear path forward. The
                  guidance and training resources gave
                </p>
                <p className="mt-5 text-[18px] leading-normal font-semibold">
                  -{review.name}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
