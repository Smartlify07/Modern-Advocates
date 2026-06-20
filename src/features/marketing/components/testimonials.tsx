"use client"

import { useEffect, useRef } from "react"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "One of the most practical learning experiences I've ever had. I was able to apply what I learned immediately.",
    name: "Alex Rivera",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    quote:
      "The instructors explained complex topics in a way that was easy to understand and implement.",
    name: "Maria Thompson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    quote:
      "The course exceeded my expectations and helped me gain confidence in my abilities.",
    name: "James Carter",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    quote:
      "I appreciated the hands-on projects. They made the learning process engaging and effective.",
    name: "Sophia Lee",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    quote:
      "The flexibility allowed me to balance my studies with work. Highly recommended for professionals.",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    quote:
      "A transformative experience. The skills I gained directly translated to a promotion at work.",
    name: "Emily Foster",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  },
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth
      if (el.scrollLeft >= maxScroll - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        el.scrollBy({ left: 360, behavior: "smooth" })
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-ma-text sm:text-5xl">
            What Our Learners Say
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar mt-14 flex gap-8 overflow-x-auto px-6 pb-4 lg:px-[calc((100vw-76rem)/2+1.5rem)]"
      >
        {testimonials.concat(testimonials).map((t, i) => (
          <article
            key={`${t.name}-${i}`}
            className="flex min-h-[28rem] w-[22rem] shrink-0 flex-col justify-between rounded-2xl bg-ma-bg p-8 sm:w-[26rem] sm:p-10"
          >
            <div>
              <Quote className="size-8 text-ma-text/15" />
              <p className="mt-5 text-base leading-relaxed text-ma-text/70">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <img
                src={t.avatar}
                alt=""
                className="size-11 rounded-full object-cover ring-2 ring-white"
                loading="lazy"
              />
              <span className="text-sm font-semibold text-ma-text">
                {t.name}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
