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
    <section id="about" className="bg-white">
      <div className="mx-auto px-4 py-12.5 sm:py-25 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-sans text-[28px]/[100%] font-extrabold tracking-[0%] text-ma-text sm:text-[40px]/[60px] sm:tracking-[-0.01em]">
            Bridging the Gap between Technology and Care
          </h2>
        </div>

        <div className="mt-10 space-y-5 text-base text-ma-text sm:mt-12.5 sm:text-lg">
          <p>We know what it feels like when life changes overnight.</p>
          <p>
            Our journey with endometriosis taught us that chronic illness
            affects far more than your health.
          </p>
          <p>
            It can impact your education, career, finances, relationships, and
            sense of security.
          </p>
          <p>
            One unexpected diagnosis can begin a chain of events that leaves
            families overwhelmed by lost income, mounting medical expenses, and
            an uncertain future.
          </p>
          <p>We have lived that reality.</p>
          <p>We also experienced something extraordinary.</p>
          <p>
            Along our journey, compassionate people stepped in to help us when
            we could not help ourselves.
          </p>
          <p>Their generosity changed the direction of our lives.</p>
          <p>
            Modern Advocates Inc. was created because we believe every person
            deserves that same opportunity.
          </p>
          <p>
            Our mission is to help people facing disability, chronic illness,
            and financial hardship regain a sense of control through education,
            technology, community, and practical support.
          </p>
          <p>We believe that knowledge reduces fear.</p>
          <p>Technology creates opportunity.</p>
          <p>Community multiplies hope.</p>
          <p>
            Artificial intelligence is more than a new technology—it is a
            powerful equalizer.
          </p>
          <p>
            Used responsibly, AI can help people organize their healthcare,
            prepare for medical appointments, learn valuable income-producing
            skills, build digital assets, and create new opportunities for
            financial independence.
          </p>
          <p>
            For women living with endometriosis, AI can also help organize
            symptoms, prepare medical histories, identify qualified specialists,
            and navigate an often overwhelming healthcare system.
          </p>
          <p>But no one should have to face these challenges alone.</p>
          <p>
            Our vision is to build a nationwide community where individuals
            support one another through education, shared knowledge, and
            innovative funding solutions that make specialized care more
            accessible.
          </p>
          <p>We cannot always choose the challenges life brings.</p>
          <p>We can choose how we respond.</p>
          <p>Our goal is simple:</p>
          <p>To replace fear with knowledge.</p>
          <p>To replace isolation with community.</p>
          <p>To replace uncertainty with opportunity.</p>
          <p>
            Together, we can build healthier lives, stronger futures, and
            greater independence.
          </p>
        </div>

        <div
          className="mt-15 flex gap-5 overflow-x-auto rounded-2xl bg-[#F5F5F5] p-5 transition-[grid-template-columns] duration-500 lg:grid lg:h-[400px] lg:max-h-[400px] lg:grid-cols-[2fr_1fr] lg:overflow-visible"
          style={{
            gridTemplateColumns: hovered === "second" ? "1fr 2fr" : undefined,
          }}
        >
          <div
            onMouseEnter={() => onHover("first")}
            onMouseLeave={onLeave}
            className="flex max-w-full shrink-0 flex-col gap-5 rounded-2xl bg-white p-5 sm:flex-row lg:max-w-none"
          >
            <div className="flex flex-col justify-between gap-2.5 sm:min-h-79.5 sm:gap-0">
              <div className="flex size-12.5 items-center justify-center rounded-full border">
                <Gift />
              </div>

              <div className="flex flex-col items-start gap-4">
                <h3 className="text-xl font-semibold text-ma-text">
                  Get Assistance
                </h3>
                <p className="text-sm text-balance text-ma-text/80">
                  Get access to AI workforce training, healthcare guidance, and
                  personalized support designed to help you move forward with
                  confidence.{" "}
                </p>
              </div>
            </div>

            <div
              className={`shrink-0 overflow-hidden rounded-2xl transition-all duration-500 max-lg:w-full max-lg:max-w-[292px] ${
                hovered === "second" ? "w-0 min-w-0" : "lg:w-[292px]"
              }`}
            >
              <Image
                src="/figma-home/get-assistance.png"
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
            className="flex max-w-full shrink-0 flex-col gap-5 rounded-2xl bg-white p-5 sm:flex-row lg:max-w-none"
          >
            <div className="flex min-w-0 flex-col justify-between gap-2.5 md:min-h-79.5">
              <div className="flex size-12.5 items-center justify-center rounded-full border">
                <Gift />
              </div>

              <div className="flex flex-col items-start gap-4">
                <h3 className="text-xl font-semibold text-ma-text">
                  Support mission
                </h3>
                <p className="text-sm text-balance text-ma-text/80">
                  Get access to AI workforce training, healthcare guidance, and
                  personalized support designed to help you move forward with
                  confidence.
                </p>
              </div>
            </div>

            <div
              className={`shrink-0 overflow-hidden rounded-2xl transition-all duration-500 max-lg:w-full max-lg:max-w-[292px] ${
                hovered === "second" ? "lg:w-[292px]" : "w-0 min-w-0"
              }`}
            >
              <Image
                src="/figma-home/get-assistance.png"
                alt=""
                className="size-full object-cover"
                loading="lazy"
                width={292}
                height={318}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FounderStorySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto px-4 py-12.5 lg:max-w-7xl lg:py-25 lg:px-25 2xl:max-w-360 2xl:px-50">
        {/* Large screens */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Image
            src="/figma-about/founder.png"
            alt=""
            className="hidden h-[500px] w-[422px] rounded-2xl object-cover lg:inline"
            loading="lazy"
            width={422}
            height={500}
          />
          <div>
            <h2 className="hidden font-sans text-[28px]/[100%] font-extrabold tracking-[0%] text-ma-text sm:text-5xl lg:block lg:text-[40px]/[60px]">
              I built ModernAdvocates Inc. out of something I lived...
            </h2>

            <div className="mt-10 hidden space-y-5 text-base text-ma-text lg:block">
              <p>
                I built ModernAdvocates Inc. out of something I lived - not
                something I studied.
              </p>
              <p>
                Navigating Endometriosis in a healthcare system that kept
                dismissing me taught me that the gap between the help that
                exists and the people who need it most is not a coincidence.
                It&apos;s a design flaw. And as AI began reshaping how we work,
                how we access care, and how we navigate every major system in
                our lives, I saw that same gap widening. So, I built the bridge.
              </p>
              <p>
                If any part of this resonates - if you&apos;ve felt unseen by a
                system that was supposed to serve you - there&apos;s a place
                here for you.
              </p>
            </div>

            <div className="text-base lg:mt-7">
              <p className="font-bold">Melanie Reyes</p>
              <p>Founder, ModernAdvocates Inc.</p>
            </div>
          </div>
        </div>

        {/* Small screens */}
        <div className="flex flex-col items-start gap-5 lg:hidden">
          <h2 className="font-sans text-[28px]/[100%] font-extrabold tracking-[0%] text-ma-text">
            I built ModernAdvocates Inc. out of something I lived...
          </h2>

          <Image
            src="/figma-about/founder.png"
            alt=""
            className="h-[415px] w-[350px] rounded-2xl object-cover"
            loading="lazy"
            width={422}
            height={500}
          />

          <div className="space-y-5 text-base text-ma-text">
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
          <div className="text-base">
            <p className="font-bold">Melanie Reyes</p>
            <p>Founder, ModernAdvocates Inc.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
