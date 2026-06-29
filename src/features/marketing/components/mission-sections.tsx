import { ArrowRight, BriefcaseBusiness, Gift } from "lucide-react"
import Image from "next/image"

const supportCards = [
  {
    title: "Get Assistance",
    description:
      "Get access to AI workforce training, healthcare guidance, and personalized support designed to help you move forward with confidence.",
  },
  {
    title: "Support Mission",
    description:
      "Get access to AI workforce training, healthcare guidance, and personalized support designed to help you move forward with confidence.",
  },
]

export function MissionBridgeSection() {
  return (
    <section id="about" className="bg-white py-25 sm:py-24 xl:px-25 2xl:px-50">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-[40px] font-extrabold tracking-[-0.01em] text-ma-text sm:text-5xl">
          Bridging the Gap between Technology and Care
        </h2>
      </div>

      <div className="mt-12.5 space-y-5 text-lg text-ma-text">
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

      <div className="mx-auto mt-15 grid gap-5 rounded-2xl bg-[#F5F5F5] p-5 md:grid-cols-[2fr_1fr]">
        <div className="flex gap-5 rounded-2xl bg-white px-5 pt-5 pb-7.5">
          <div className="flex min-h-[318px] flex-col justify-between">
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
          <Image
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=700&q=80"
            alt=""
            className="size-full min-w-[292px] rounded-2xl object-cover"
            loading="lazy"
            width={292}
            height={318}
          />
        </div>

        <div className="flex gap-5 rounded-2xl bg-white px-5 pt-5 pb-7.5">
          <div className="flex min-h-[318px] flex-col justify-between">
            <div className="flex size-12.5 items-center justify-center rounded-full border">
              <Gift />
            </div>

            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold text-ma-text">
                Support mission{" "}
              </h3>
              <p className="text-sm text-ma-text/80">
                Get access to AI workforce training, healthcare guidance, and
                personalized support designed to help you move forward with
                confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FounderStorySection() {
  return (
    <section className="bg-white py-20 sm:py-24 xl:px-25 2xl:px-50">
      <div className="mx-auto items-center items-start gap-10 lg:grid lg:grid-cols-[0.8fr_1.2fr]">
        <Image
          src="/figma-about/founder.png"
          alt=""
          className="h-[500px] w-[422px] rounded-2xl object-cover"
          loading="lazy"
          width={422}
          height={500}
        />

        <div>
          <h2 className="font-sans text-[40px]/[60px] font-extrabold tracking-[0%] text-ma-text sm:text-5xl">
            I built ModernAdvocates Inc. out of something I lived...
          </h2>

          <div className="mt-10 space-y-5 text-base text-ma-text">
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
