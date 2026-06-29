import { Card, CardDescription, CardTitle } from "@/shared/ui/card"
import { cn } from "@/shared/utils"
import { Gift } from "lucide-react"
import Image from "next/image"
import React from "react"

const AboutOurValuesSection = () => {
  return (
    <section id="about" className="bg-white py-25 sm:py-24 xl:px-25 2xl:px-50">
      <p className="mb-[19px] text-center text-base leading-normal font-medium tracking-[10%] text-[#6b7280] uppercase">
        OUR VALUES{" "}
      </p>
      <div className="mx-auto text-center">
        <h2 className="mx-auto max-w-160 text-center font-sans text-[40px] font-extrabold text-ma-text sm:text-5xl">
          How can we support your healthcare journey?{" "}
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-5 text-center text-lg text-ma-text">
        <p>
          ModernAdvocates creates a continuous learning system that improves
          outcomes while expanding access to support.
        </p>
      </div>

      <div className="mx-auto mt-15.5 grid gap-4 rounded-2xl bg-[#f5f5f5] p-4">
        <div className="grid grid-cols-2 gap-4">
          <SupportCard
            title="Card Title"
            description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
          />
          <SupportCard
            title="Card Title"
            description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
          />{" "}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SupportCard
            title="Card Title"
            description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
          />
          <SupportCard
            title="Card Title"
            description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
          />
          <SupportCard
            title="Card Title"
            description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
          />
        </div>
      </div>
    </section>
  )
}

function SupportCard({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <Card className={cn("col-span-1 gap-7.5 px-5 py-7.5 ring-0", className)}>
      <div className="flex size-10 items-center justify-center rounded-full border">
        <Gift />
      </div>

      <div className="flex flex-col gap-5">
        <CardTitle className="font-sans font-bold text-black">
          {title}
        </CardTitle>
        <CardDescription className="text-black">{description}</CardDescription>
      </div>
    </Card>
  )
}
export default AboutOurValuesSection
