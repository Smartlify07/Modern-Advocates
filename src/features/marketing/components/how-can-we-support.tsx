import { Card, CardDescription, CardTitle } from "@/shared/ui/card"
import { cn } from "@/shared/utils"
import { Gift } from "lucide-react"
import Image from "next/image"
import React from "react"

const SupportSection = () => {
  return (
    <section id="about" className="bg-white px-6 py-25 sm:py-24">
      <div className="mx-auto max-w-[1044px]">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-[40px] font-extrabold text-ma-text sm:text-5xl">
            How can we support your healthcare journey?{" "}
          </h2>
        </div>

        <div className="mx-auto mt-12.5 max-w-3xl space-y-5 text-center text-lg text-ma-text">
          <p>
            ModernAdvocates creates a continuous learning system that improves
            outcomes while expanding access to support.
          </p>
        </div>

        <div className="mx-auto mt-15 grid max-w-5xl gap-4 rounded-2xl bg-[#f5f5f5] p-4">
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
export default SupportSection
