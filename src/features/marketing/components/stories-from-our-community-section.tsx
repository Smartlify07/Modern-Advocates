"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

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
    image: "/figma-home/community-story-3.png",
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
]

export const StoriesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStory = stories[activeIndex]

  function showPreviousStory() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? stories.length - 1 : currentIndex - 1
    )
  }

  function showNextStory() {
    setActiveIndex((currentIndex) =>
      currentIndex === stories.length - 1 ? 0 : currentIndex + 1
    )
  }

  return (
    <section className="bg-white py-12.5 text-ma-text sm:py-25">
      <div className="mx-auto px-4 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <header className="mx-auto max-w-[774px] text-center">
          <h2 className="text-[32px]/[1.1] font-bold text-primary lg:text-[3.5rem]">
            Stories from our community
          </h2>
          <p className="mx-auto mt-7.5 max-w-[704px] text-base font-medium text-ma-text sm:text-xl">
            Kind words from family and friends we have supported mentally,
            emotionally, physically, and financially throughout the years.
          </p>
        </header>

        <div className="mt-12.5 overflow-hidden lg:mt-20">
          <article className="grid gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,605px)] lg:items-start lg:gap-[50px]">
            <div className="relative min-h-[340px] overflow-hidden rounded-3xl bg-ma-bg sm:min-h-[460px] lg:h-[560px]">
              <Image
                key={activeStory.image}
                src={activeStory.image}
                alt={activeStory.imageAlt}
                fill
                sizes="(min-width: 1024px) 600px, calc(100vw - 32px)"
                className={cn(
                  "object-cover transition-opacity duration-300",
                  activeStory.imageClassName
                )}
              />
            </div>

            <div className="flex min-h-[420px] flex-col justify-between lg:min-h-[560px]">
              <p className="text-3xl font-medium text-primary">
                {activeStory.quote}
              </p>

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base font-semibold text-primary sm:text-2xl">
                    {activeStory.name}
                  </h3>
                  <p className="text-base text-ma-muted-text sm:text-xl">
                    {activeStory.role}
                  </p>
                </div>

                <div className="flex gap-[18px]">
                  <button
                    type="button"
                    aria-label="Previous community story"
                    onClick={showPreviousStory}
                    className="flex size-[50px] items-center justify-center rounded-full border border-border bg-ma-bg text-primary transition-colors hover:border-ma-text/20 hover:bg-white sm:size-[60px]"
                  >
                    <ArrowLeft className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next community story"
                    onClick={showNextStory}
                    className="flex size-[50px] items-center justify-center rounded-full border border-border bg-ma-bg text-primary transition-colors hover:border-ma-text/20 hover:bg-white sm:size-[60px]"
                  >
                    <ArrowRight className="size-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
