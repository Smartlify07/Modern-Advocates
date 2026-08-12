"use client"

import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"

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
  {
    src: "/figma-about/impact-photo-9.png",
    alt: "Modern Advocates friends and supporters",
    imageClassName: "object-[50%_10%]",
  },
]

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AboutImpactCarouselSection() {
  const containerRef = useRef(null)

  useGSAP(() => {}, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative isolate max-h-[950px] overflow-hidden bg-ma-text"
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

      <div className="mx-auto h-[718px] max-w-[590px] px-4 sm:px-0">
        <div className="hide-scrollbar flex h-full flex-col gap-10 overflow-y-scroll pt-35 pb-10 sm:gap-20">
          {impactPhotos.map((photo) => (
            <article
              key={photo.src}
              className="shrink-0 bg-white p-4 shadow-2xl shadow-black/20 last:pb-14 sm:h-[470px] sm:p-5 sm:pb-[70px]"
            >
              <div className="relative aspect-[55/38] w-full overflow-hidden bg-ma-bg sm:h-[380px]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  quality={100}
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
