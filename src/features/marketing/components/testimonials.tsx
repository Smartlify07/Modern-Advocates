"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

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

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -64, opacity: 0 }),
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(0)
  const [[pageIndex, direction], setPageIndex] = useState([0, 0])

  const visibleCount = isMobile ? 1 : 3
  const maxIndex = Math.max(0, reviews.length - visibleCount)

  function showPrevious() {
    setPageIndex(([currentIndex]) => [
      currentIndex === 0 ? maxIndex : currentIndex - 1,
      -1,
    ])
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? maxIndex : currentIndex - 1
    )
  }

  function showNext() {
    setPageIndex(([currentIndex]) => [
      currentIndex === maxIndex ? 0 : currentIndex + 1,
      1,
    ])
    setActiveIndex((currentIndex) =>
      currentIndex === maxIndex ? 0 : currentIndex + 1
    )
  }

  const visibleReviews = reviews.slice(pageIndex, pageIndex + visibleCount)

  return (
    <section className="bg-white">
      <div className="marketing-container">
        <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="marketing-header text-[28px]/[100%] font-extrabold text-primary lg:text-[40px] lg:leading-15">
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
              onClick={showPrevious}
              className="flex size-[50px] items-center justify-center rounded-2xl bg-ma-surface-2 text-black transition-colors hover:bg-ma-surface-2"
            >
              <ArrowLeft className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next review"
              onClick={showNext}
              className="flex size-[50px] items-center justify-center rounded-2xl bg-ma-surface-2 text-black transition-colors hover:bg-ma-surface-2"
            >
              <ArrowRight className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative mx-auto mt-21.5 overflow-hidden px-4 lg:w-full lg:max-w-[1050px] lg:px-0"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={pageIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="hide-scrollbar flex gap-7.5 overflow-x-auto pb-2"
          >
            {visibleReviews.map((review) => (
              <article
                key={review.image}
                className="relative flex h-[500px] w-[330px] shrink-0 flex-col justify-end overflow-hidden rounded-3xl px-[15px] pb-[30px] lg:w-[calc((100%-60px)/3)]"
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
