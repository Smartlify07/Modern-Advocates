"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const impactPhotos = [
  {
    src: "/figma-about/impact-photo-1.png",
    alt: "Modern Advocates community members by the London Eye",
  },
  {
    src: "/figma-about/impact-photo-8.png",
    alt: "Modern Advocates community members smiling together",
  },
  {
    src: "/figma-about/impact-photo-6.png",
    alt: "Modern Advocates community gathering",
  },
  {
    src: "/figma-about/impact-photo-2.png",
    alt: "Modern Advocates supporters together",
  },
  {
    src: "/figma-about/impact-photo-5.png",
    alt: "Modern Advocates community moment",
  },
  {
    src: "/figma-about/impact-photo-4.png",
    alt: "Modern Advocates family and supporters",
    imageClassName: "object-[50%_8%]",
  },
  {
    src: "/figma-about/impact-photo-3.png",
    alt: "Modern Advocates friends and supporters",
    imageClassName: "object-[50%_10%]",
  },
]

export function AboutImpactCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const stack = stackRef.current
    if (!section || !viewport || !stack) return

    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(stack.scrollHeight - viewport.clientHeight, 0)

      gsap.to(stack, {
        y: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: section,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-ma-text pt-16 sm:pt-25 lg:min-h-[963px] lg:py-[150px]"
    >
      <Image
        src="/figma-home/about-impact-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none -z-10 scale-105 object-cover opacity-80 blur-[15px]"
      />
      <div
        className="absolute inset-0 -z-10 bg-ma-text/25"
        aria-hidden="true"
      />

      <div
        ref={viewportRef}
        className="mx-auto max-w-[590px] translate-y-40 overflow-hidden px-4 sm:h-[718px] sm:px-0"
      >
        <div ref={stackRef} className="flex flex-col gap-10 sm:gap-20">
          {impactPhotos.map((photo) => (
            <article
              key={photo.src}
              className="shrink-0 snap-center bg-white p-4 pb-14 shadow-2xl shadow-black/20 sm:h-[470px] sm:p-5 sm:pb-[70px]"
            >
              <div className="relative aspect-[55/38] w-full overflow-hidden bg-ma-bg sm:h-[380px]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 550px, calc(100vw - 64px)"
                  className={photo.imageClassName ?? "object-cover"}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
