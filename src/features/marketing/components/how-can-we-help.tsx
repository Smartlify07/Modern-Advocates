import { Handshake, HeartPlus, Laptop } from "lucide-react"
import React from "react"

const cardsData = [
  {
    id: 1,
    title: "Healthcare Navigation",
    icon: HeartPlus,
    description:
      "Helping individuals navigate healthcare, organize medical information, and make informed decisions.",
  },
  {
    id: 2,
    icon: Laptop,
    title: "Practical AI Skills",
    description:
      "Learn how to use AI to simplify daily life, strengthen career opportunities, navigate healthcare, and increase productivity.",
  },
  {
    id: 3,
    icon: Handshake,
    title: "Community Support",
    description:
      "Connecting people with resources, encouragement, and practical guidance so no one faces life’s challenges alone.",
  },
]

const HowCanWeHelpSection = () => {
  return (
    <section className="bg-ma-bg py-12.5 text-ma-text lg:py-25">
      <div className="mx-auto px-4 lg:max-w-7xl lg:px-25 2xl:max-w-360">
        <header className="mx-auto mb-7.5 text-center text-3xl font-bold text-primary sm:text-5xl">
          <h1>How Can We Help</h1>
        </header>

        <p className="mx-auto mb-16 max-w-[750px] text-center sm:text-xl">
          Modern Advocates helps individuals and families facing chronic
          illness, disability, and financial hardship build healthier, more
          independent futures through education, advocacy, AI, and compassionate
          support.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cardsData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-12.5 rounded-2xl border bg-white px-5 py-7.5"
            >
              <item.icon className="-ma-admin-primary text-ma-admin-primary" />
              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-bold text-primary sm:text-2xl">
                  {item.title}
                </h3>
                <p className="sm:text-xl/[32px]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowCanWeHelpSection
