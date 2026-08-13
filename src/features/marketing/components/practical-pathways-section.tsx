"use client"

import { Fragment, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Image from "next/image"

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
  const textContainerRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const textContainer = textContainerRef.current

      if (!section || !textContainer) return

      if (!window.matchMedia("(min-width: 768px)").matches) return
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
       * --------------------------------------------------
       * INITIAL POSITION
       * --------------------------------------------------
       *
       * Block 1 starts in the viewport.
       *
       * Blocks 2–5 are underneath it in the vertical
       * track and therefore aren't visible.
       */

      gsap.set(textContainer, {
        y: 0,
      })

      /*
       * --------------------------------------------------
       * SCROLL DISTANCE
       * --------------------------------------------------
       *
       * There are 4 transitions for 5 items.
       *
       * Each transition gets 80% of a viewport.
       *
       * You can change this to:
       *
       * 1    = slower
       * 0.8  = current
       * 0.6  = faster
       */

      const transitionDistance = window.innerHeight * 1.4

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          /*
           * Pin when the section reaches the top.
           */
          start: () => "300px top",

          /*
           * Four transitions.
           */
          end: () => `+=${transitionDistance * (items.length - 1)}`,

          pin: true,

          /*
           * Direct relationship between scroll and movement.
           */
          scrub: 0.4,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          markers: false,
        },
      })

      /*
       * --------------------------------------------------
       * MOVE THE TEXT TRACK
       * --------------------------------------------------
       *
       * Instead of fading individual blocks, we move
       * the entire stack.
       *
       * Each block has the same height.
       *
       * 0%   = Item 1
       * -100% = Item 2
       * -200% = Item 3
       * -300% = Item 4
       * -400% = Item 5
       */

      timeline.to(textContainer, {
        y: () => {
          /*
           * The container needs to move by exactly one
           * "step" for every transition.
           *
           * The step is the distance from the top of one
           * block to the top of the next one — block
           * height plus the spacer that keeps the next
           * item out of view until the previous exits.
           *
           * Measuring it in the DOM makes the animation
           * independent of viewport dimensions.
           */

          const step =
            blocks.length > 1
              ? blocks[1].offsetTop - blocks[0].offsetTop
              : blocks[0].offsetHeight

          return -(step * (items.length - 1))
        },

        ease: "none",

        duration: items.length - 1,
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#101827] text-white md:min-h-screen"
    >
      <div className="marketing-container relative flex flex-col gap-20 md:min-h-screen md:gap-0">
        <div className="text-center">
          <h2 className="marketing-header marketing-headline mx-auto max-w-[850px] text-white!">
            Practical pathways to improved health outcomes
          </h2>

          <p className="mt-7.5 text-base text-white/70 sm:text-xl">
            Our shared values
          </p>
        </div>

        <div className="flex flex-col-reverse gap-10 md:grid md:min-h-screen md:max-w-260 md:grid-cols-2 md:justify-items-center md:gap-16 md:self-center">
          <div className="relative flex items-center md:hidden">
            <div className="flex w-full flex-col gap-14">
              {items.map((item) => (
                <div key={item.id}>
                  <h3 className="marketing-header marketing-headline text-white! md:max-w-xl">
                    {item.label}
                  </h3>

                  <p className="mt-7 font-inter text-base font-medium text-white/60 sm:text-xl md:max-w-[460px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden items-center md:flex md:min-h-screen">
            <div className="relative w-full overflow-hidden md:mt-40 md:mt-48 md:h-[420px] md:h-[460px]">
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

          <div className="relative flex items-center justify-center md:min-h-screen">
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
