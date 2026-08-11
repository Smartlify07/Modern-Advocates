import { Button } from "@/shared/ui/button"
import { GradientButton } from "@/shared/ui/gradient-button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import React from "react"

const AboutSupportMissionSection = () => {
  return (
    <section>
      <div className="marketing-container flex flex-col items-center sm:gap-50">
        <div className="flex w-full flex-col gap-12 sm:flex-row sm:items-center sm:gap-25">
          <Image
            src={"/figma-home/community.png"}
            alt="People putting hands together"
            width={600}
            height={560}
            className="h-70 w-full rounded-2xl object-cover sm:h-140 sm:w-150"
          />

          <div className="r flex max-w-[430px] flex-col gap-6 sm:gap-12.5">
            <h1 className="marketing-header marketing-headline leading-[60px]">
              Help someone build a better future
            </h1>
            <p className="text-base sm:text-xl">
              Partner with us to help people affected by chronic illness,
              disability, and financial hardship rebuild confidence through AI
              education, and health advocacy.
            </p>

            <GradientButton className="h-15 w-full sm:w-75 sm:text-base">
              Support our mission{" "}
              <ArrowRight className="relative z-10 size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />{" "}
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSupportMissionSection
