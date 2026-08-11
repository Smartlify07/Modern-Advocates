import { Card, CardDescription, CardTitle } from "@/shared/ui/card"
import { cn } from "@/shared/utils"
import { Gift } from "lucide-react"

const AboutOurValuesSection = () => {
  return (
    <section id="about" className="bg-white">
      <div className="marketing-container">
        <p className="mb-5 text-center text-sm leading-normal font-medium tracking-[10%] text-muted-foreground uppercase sm:text-base">
          OUR VALUES{" "}
        </p>
        <div className="mx-auto text-center">
          <h2 className="marketing-header mx-auto max-w-160 text-center text-[28px]/[100%] font-extrabold text-ma-text sm:text-5xl lg:text-[40px]">
            How can we support your healthcare journey?{" "}
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-5 text-center text-base text-ma-text lg:text-lg">
          <p>
            ModernAdvocates creates a continuous learning system that improves
            outcomes while expanding access to support.
          </p>
        </div>

        <div className="mx-auto mt-15.5 grid gap-4 rounded-2xl bg-ma-surface-2 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <SupportCard
              title="AI Education"
              description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
            />
            <SupportCard
              title="Health Advocacy"
              description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
            />{" "}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <SupportCard
              title="Community"
              description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
            />
            <SupportCard
              title="Endometriosis Specialist"
              description="We create distinctive brand identities that communicate your values clearly and build strong connections with your audience."
            />
            <SupportCard
              title="Future Vision"
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
export default AboutOurValuesSection
