"use client"

import { Gift } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function MissionBridgeSection() {
  const [hovered, setHovered] = useState<"first" | "second" | null>(null)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setIsLargeScreen(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  function onHover(card: "first" | "second") {
    if (!isLargeScreen) return
    setHovered(card)
  }

  function onLeave() {
    if (!isLargeScreen) return
    setHovered(null)
  }

  return (
    <section
      id="about"
      className="bg-white px-4 py-12.5 sm:py-25 xl:px-25 2xl:px-50"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-sans text-[28px]/[100%] font-extrabold tracking-[0%] text-ma-text sm:text-5xl sm:text-[40px] sm:tracking-[-0.01em]">
          Bridging the Gap between Technology and Care
        </h2>
      </div>

      <div className="mt-10 space-y-5 text-base text-ma-text sm:mt-12.5 sm:text-lg">
        <p>
          Millions of people face delayed diagnoses, fragmented care, and
          limited access to support. At the same time, AI technology is
          advancing faster than individuals, caregivers, and systems can safely
          use it.
        </p>
        <p>
          ModernAdvocates bridges this gap - by combining Safe AI usage,
          Human-centered design, and Real-world application.
        </p>
        <p>
          We built an integrated ecosystem where artificial intelligence is not
          just a tool - but a guided, safe, and practical resource for real
          people navigating real health challenges.
        </p>
        <p className="underline underline-offset-2">
          The result is better navigation, earlier intervention, and more
          informed decision-making.
        </p>
      </div>

      <div
        className="mt-15 grid gap-5 rounded-2xl bg-[#F5F5F5] p-5 transition-[grid-template-columns] duration-500 md:grid-cols-[2fr_1fr]"
        style={{
          gridTemplateColumns: hovered === "second" ? "1fr 2fr" : undefined,
        }}
      >
        <div
          onMouseEnter={() => onHover("first")}
          onMouseLeave={onLeave}
          className="flex flex-col gap-5 rounded-2xl bg-white p-5 sm:flex-row"
        >
          <div className="flex flex-col justify-between gap-2.5 sm:min-h-79.5 sm:gap-0">
            <div className="flex size-12.5 items-center justify-center rounded-full border">
              <Gift />
            </div>

            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold text-ma-text">
                Get Assistance
              </h3>
              <p className="text-sm text-ma-text/80">
                Get access to AI workforce training, healthcare guidance, and
                personalized support designed to help you move forward with
                confidence.{" "}
              </p>
            </div>
          </div>

          <div
            className={`shrink-0 overflow-hidden rounded-2xl transition-all duration-500 max-lg:hidden ${
              hovered === "second" ? "w-0 min-w-0" : "w-[292px]"
            }`}
          >
            <Image
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=700&q=80"
              alt=""
              className="size-full object-cover"
              loading="lazy"
              width={292}
              height={318}
            />
          </div>
        </div>

        <div
          onMouseEnter={() => onHover("second")}
          onMouseLeave={onLeave}
          className="flex gap-5 rounded-2xl bg-white p-5 sm:flex"
        >
          <div className="flex min-w-0 flex-col justify-between gap-2.5 sm:min-h-79.5">
            <div className="flex size-12.5 items-center justify-center rounded-full border">
              <Gift />
            </div>

            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold text-ma-text">
                Support mission
              </h3>
              <p className="text-sm text-ma-text/80">
                Get access to AI workforce training, healthcare guidance, and
                personalized support designed to help you move forward with
                confidence.
              </p>
            </div>
          </div>

          <div
            className={`shrink-0 overflow-hidden rounded-2xl transition-all duration-500 max-lg:hidden ${
              hovered === "second" ? "lg:w-[292px]" : "w-0 min-w-0"
            }`}
          >
            <Image
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700&q=80"
              alt=""
              className="size-full object-cover"
              loading="lazy"
              width={292}
              height={318}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function FounderStorySection() {
  return (
    <section className="bg-white px-4 py-20 sm:py-24 xl:px-25 2xl:px-50">
      <div className="mx-auto flex flex-col-reverse items-start gap-10 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <Image
          src="/figma-about/founder.png"
          alt=""
          className="h-[500px] w-[422px] rounded-2xl object-cover"
          loading="lazy"
          width={422}
          height={500}
        />

        <div className="mt-10 space-y-5 text-base text-ma-text lg:hidden">
          <p>
            I built ModernAdvocates Inc. out of something I lived - not
            something I studied.
          </p>
          <p>
            Navigating Endometriosis in a healthcare system that kept dismissing
            me taught me that the gap between the help that exists and the
            people who need it most is not a coincidence. It&apos;s a design
            flaw. And as AI began reshaping how we work, how we access care, and
            how we navigate every major system in our lives, I saw that same gap
            widening. So, I built the bridge.
          </p>
          <p>
            If any part of this resonates - if you&apos;ve felt unseen by a
            system that was supposed to serve you - there&apos;s a place here
            for you.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-[28px]/[100%] font-extrabold tracking-[0%] text-ma-text sm:text-5xl lg:text-[40px]/[60px]">
            I built ModernAdvocates Inc. out of something I lived...
          </h2>

          <div className="mt-10 hidden space-y-5 text-base text-ma-text lg:block">
            <p>
              I built ModernAdvocates Inc. out of something I lived - not
              something I studied.
            </p>
            <p>
              Navigating Endometriosis in a healthcare system that kept
              dismissing me taught me that the gap between the help that exists
              and the people who need it most is not a coincidence. It&apos;s a
              design flaw. And as AI began reshaping how we work, how we access
              care, and how we navigate every major system in our lives, I saw
              that same gap widening. So, I built the bridge.
            </p>
            <p>
              If any part of this resonates - if you&apos;ve felt unseen by a
              system that was supposed to serve you - there&apos;s a place here
              for you.
            </p>
          </div>

          <div className="mt-7 text-base">
            <p className="font-bold">Melanie Reyes</p>
            <p>Founder, ModernAdvocates Inc.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
