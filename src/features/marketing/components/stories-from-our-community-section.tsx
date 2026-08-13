"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import gsap from "gsap"

import { cn } from "@/shared/utils"

const stories = [
  {
    image: "/figma-home/community-story-1.png",
    imageAlt: "Cheryl Stephenson smiling with family",
    quote:
      "Whether it's of a medical, emotional, or a financial nature- Melanie has been the mentor and advocate for hundreds of people over the years. People are drawn to her, and she never lets them down. She is deserving of any support that comes her way.",
    name: "Cheryl Stephenson",
    role: "Friend & Supporter",
    imageClassName: "object-[50%_18%]",
  },
  {
    image: "/figma-home/community-story-2.png",
    imageAlt: "Suki with Modern Advocates community members",
    quote:
      "Knowing Meliene and Will has been a real privilege and even though we have spent little time together, they are individuals I will remember for the rest of my life. Their kindness, generosity and compassion are such genuine and unforgettable traits that are rare to come across in life.",
    name: "Suki",
    role: "Friend & Supporter",
    imageClassName: "object-[50%_72%]",
  },
  {
    image: "/figma-home/community-story-6.png",
    imageAlt: "Rosa Sanchez outdoors with loved ones",
    quote:
      "The calm in the eye of the storm. That's Mel and Will, they have managed to remain grounded during the fiercest storms life can throw at you. They are the blue skies that can only be found in the eye of the hurricane. The amazing part is that even in the mist of their own problems and challenges, they will step out of their world and support others.",
    name: "Rosa Sanchez",
    role: "Family Friend & Supporter",
    imageClassName: "object-[50%_20%]",
  },
  {
    image: "/figma-home/community-story-4.png",
    imageAlt: "Karen Johnson with family and supporters",
    quote:
      "I have known Mel and Will for nine years. No matter what they are going through they have been there for us and many of our friends. Knowledgeable. Compassionate. Generous with their time and energy. Supportive. Always thinking of a way to improve the lives of others!",
    name: "Karen Johnson",
    role: "Family Friend & Supporter",
    imageClassName: "object-center",
  },
  {
    image: "/figma-home/community-story-5.png",
    imageAlt: "Shdel Menchan - Harell smiling in a community photo",
    quote:
      "If you're looking for someone who is knowledgeable, compassionate, trustworthy, and deeply committed to improving women's lives, I cannot recommend Melanie highly enough. She is more than an advocate, she is a voice for women who have spent far too long feeling unheard.",
    name: "Shdel Menchan - Harell",
    role: "Friend & Supporter",
    imageClassName: "object-center",
  },
  {
    image: "/figma-home/community-story-7.png",
    imageAlt: "Edith Stephenson",
    quote:
      "I’ve watched Mel and Wil turn some of life’s hardest challenges into something meaningful for others. Their determination to take their personal experiences and use them to help people facing similar struggles speaks to their compassion and resilience. I wish them every success with this mission.",
    name: "Edith Stephenson",
    role: "Friend & Supporter",
    imageClassName: "object-center",
  },
]

export const StoriesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const isTransitioningRef = useRef(false)

  function transitionTo(nextIndex: number) {
    const track = trackRef.current
    if (!track || nextIndex === activeIndex || isTransitioningRef.current)
      return

    isTransitioningRef.current = true
    gsap.to(track, {
      x: -nextIndex * track.clientWidth,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveIndex(nextIndex)
        isTransitioningRef.current = false
      },
    })
  }

  function showPreviousStory() {
    if (activeIndex === 0) return
    transitionTo(activeIndex - 1)
  }

  function showNextStory() {
    if (activeIndex === stories.length - 1) return
    transitionTo(activeIndex + 1)
  }

  return (
    <section className="bg-white text-ma-text">
      <div className="marketing-container">
        <header className="mx-auto text-center">
          <h2 className="marketing-header marketing-headline">
            Stories from our community
          </h2>
          <p className="mx-auto mt-7.5 max-w-[704px] text-base font-medium text-ma-text sm:text-xl">
            Kind words from family and friends we have supported mentally,
            emotionally, physically, and financially throughout the years.
          </p>
        </header>

        <div className="mt-12.5 overflow-hidden lg:mt-20">
          <div ref={trackRef} className="flex w-full will-change-transform">
            {stories.map((story) => (
              <div
                key={story.name}
                className="grid w-full min-w-full shrink-0 gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,605px)] lg:items-start lg:gap-[50px]"
              >
                <div className="relative min-h-[340px] overflow-hidden rounded-3xl bg-ma-bg sm:min-h-[460px] lg:h-[560px]">
                  <Image
                    src={story.image}
                    alt={story.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 600px, calc(100vw - 32px)"
                    className={cn("object-cover", story.imageClassName)}
                  />
                </div>

                <div className="flex min-h-[420px] flex-col justify-between lg:min-h-[560px]">
                  <p className="text-xl font-medium text-primary lg:text-2xl/[32px] xl:text-3xl/[45px]">
                    {story.quote}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="marketing-header text-base font-semibold text-primary lg:text-xl xl:text-2xl">
                        {story.name}
                      </h3>
                      <p className="text-base text-ma-muted-text lg:text-lg xl:text-xl">
                        {story.role}
                      </p>
                    </div>
                    <div className="flex justify-center gap-[18px]">
                      <button
                        type="button"
                        aria-label="Previous community story"
                        onClick={showPreviousStory}
                        disabled={activeIndex === 0}
                        className="flex size-[50px] items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-ma-text/20 hover:bg-white disabled:cursor-not-allowed disabled:bg-ma-bg disabled:text-[#D9D9D9] disabled:hover:border-border disabled:hover:bg-ma-bg sm:size-[60px]"
                      >
                        <ArrowLeft className="size-6" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next community story"
                        onClick={showNextStory}
                        disabled={activeIndex === stories.length - 1}
                        className="flex size-[50px] items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-ma-text/20 hover:bg-white disabled:cursor-not-allowed disabled:bg-ma-bg disabled:text-[#D9D9D9] disabled:hover:border-border disabled:hover:bg-ma-bg sm:size-[60px]"
                      >
                        <ArrowRight className="size-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
