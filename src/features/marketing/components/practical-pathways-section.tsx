"use client"

import { Fragment, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Item = {
  id: number
  color: string
  label: string
  description: string
}

const items: Item[] = [
  {
    id: 1,
    color: "var(--hue-1)",
    label: "Restoring Hope",
    description:
      "We believe every person deserves hope, dignity, and the opportunity to move forward, regardless of disability, chronic illness, or financial hardship.",
  },
  {
    id: 2,
    color: "var(--hue-2)",
    label: "Empowering Independence",
    description:
      "Our mission is to help people transform life’s greatest challenges into opportunities for greater independence through education, technology, and practical support.",
  },
  {
    id: 3,
    color: "var(--hue-3)",
    label: "AI Education",
    description:
      "We help patients navigate complex medical conditions—especially endometriosis—by promoting education, organization, informed decision-making, and access to specialized care.",
  },
  {
    id: 4,
    color: "var(--hue-4)",
    label: "Community",
    description:
      "We believe lives are changed when people encourage, educate, and support one another. Together, we can accomplish more than any individual alone.",
  },
  {
    id: 5,
    color: "var(--hue-5)",
    label: "Innovation with Purpose",
    description:
      "We embrace technology not for its own sake, but as a tool to make education, healthcare navigation, and economic opportunity more accessible to everyone.",
  },
]

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const textContainerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const textContainer = textContainerRef.current

    if (!section || !viewport || !textContainer) return

    const ctx = gsap.context(() => {
      /*
       * Each text block occupies one full viewport-sized
       * "slot" in the vertical text track.
       *
       * We then move the entire track upward.
       */

      const blocks = gsap.utils.toArray<HTMLElement>(
        ".scroll-story-block",
        textContainer
      )

      if (!blocks.length) return

      /*
       * The track travels exactly one "step" per
       * transition.
       *
       * The step is the distance from the top of one
       * block to the top of the next one — block height
       * plus the spacer that keeps the next item out of
       * view until the previous exits.
       *
       * Measuring it in the DOM makes the animation
       * independent of viewport dimensions.
       */

      const distance = () => {
        const step =
          blocks.length > 1
            ? blocks[1].offsetTop - blocks[0].offsetTop
            : blocks[0].offsetHeight

        return step * (items.length - 1)
      }

      gsap.to(textContainer, {
        y: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: section,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false,
        },
      })
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#101827] text-white"
    >
      <div className="marketing-container relative flex min-h-screen flex-col">
        <div className="text-center">
          <h2 className="marketing-header marketing-headline mx-auto max-w-[850px] text-white!">
            Practical pathways to improved health outcomes
          </h2>

          <p className="mt-7.5 text-base text-white/70 sm:text-xl">
            Our shared values
          </p>
        </div>

        <div className="grid min-h-screen max-w-260 grid-cols-1 justify-items-center gap-10 self-center md:grid-cols-2 md:gap-16">
          <div className="relative flex min-h-screen items-center">
            <div className="relative mt-40 h-[420px] w-full overflow-hidden md:mt-48 md:h-[460px]">
              <div
                ref={viewportRef}
                className="absolute inset-0 overflow-hidden"
              >
                <div ref={textContainerRef} className="top-0 left-0 w-full">
                {items.map((item, index) => (
                  <Fragment key={item.id}>
                    <div className="scroll-story-block flex h-[394px] w-full flex-col justify-center md:h-[394px]">
                      <h3 className="marketing-header marketing-headline max-w-xl text-white!">
                        {item.label}
                      </h3>

                      <p className="mt-7 max-w-[460px] font-inter text-base font-medium text-white/60 sm:text-xl">
                        {item.description}
                      </p>
                    </div>

                    {index < items.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="h-[420px] md:h-[460px]"
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          </div>

          <div className="relative flex min-h-screen items-center justify-center">
            <div className="relative w-full max-w-[520px] overflow-hidden">
              <img
                src="/figma-home/restoring-hope.png"
                alt="Three girls smiling together"
                className="block aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
