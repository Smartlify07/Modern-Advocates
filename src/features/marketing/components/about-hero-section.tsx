import Image from "next/image"
import { Star } from "lucide-react"

const supporters = [
  "/figma-about/supporter-1.png",
  "/figma-about/supporter-2.png",
  "/figma-about/supporter-3.png",
  "/figma-about/supporter-4.png",
]

export function AboutHeroSection() {
  return (
    <section className="bg-white text-ma-text">
      <div className="marketing-container">
        <header className="mx-auto mb-15 max-w-230 text-center">
          <h4 className="marketing-header mb-7.5 text-base text-muted-foreground uppercase">
            Our story
          </h4>

          <h1 className="marketing-header marketing-headline max-w-230 capitalize">
            Why we started modern advocates
          </h1>
        </header>

        <div className="mb-12 flex flex-col gap-17.5 sm:flex-row">
          <Image
            src="/figma-home/melanie-and-will.png"
            alt="Melanie and Will"
            className="rounded-2xl object-cover sm:w-[532px] sm:w-[570px]"
            width={570}
            height={532}
          />

          <p className="text-base sm:text-xl/[32px]">
            Our own journey with endometriosis taught us that chronic illness
            affects far more than physical health. It can reshape your
            education, career, finances, relationships, and sense of security. A
            single diagnosis can begin a chain of events that leaves individuals
            and families facing lost income, mounting medical expenses, and an
            uncertain future. <br /> <br />
            We have lived that reality. <br /> <br />
            We also experienced something extraordinary. Along our journey,
            compassionate people stepped in to help us when we could not help
            ourselves. Their kindness changed the direction of our lives.
            <br />
            <br />
            Modern Advocates Inc. was created because we believe every person
            deserves that same opportunity.
          </p>
        </div>

        <p className="text-base sm:text-xl">
          Our mission is to help individuals facing disability, chronic illness,
          and financial hardship regain a sense of control through education,
          technology, community, and practical support. We believe that
          knowledge reduces fear. Technology creates opportunity. Community
          multiplies hope. <br /> <br />
          Artificial intelligence is more than a new technology—it can be a
          powerful equalizer. Used responsibly, AI can help people organize
          healthcare information, prepare for medical appointments, learn
          valuable skills, create digital assets, and build new opportunities
          for financial independence. <br /> <br />
          For individuals living with endometriosis and other complex
          conditions, AI can also support symptom tracking, medical history
          organization, preparation for specialist consultations, and navigation
          of an often overwhelming healthcare system. But no one should face
          these challenges alone.
          <br />
          <br /> <strong className="font-bold">Our goal is simple: </strong>
          <br />
          i. Replace fear with knowledge. <br /> ii. Replace isolation with
          community. <br /> iii. Replace uncertainty with opportunity. <br />{" "}
          <br /> Together, we can build healthier lives, stronger futures, and
          greater independence. <br />
          <br />
          Many organizations ask, “How can we help people?”
          <br />
          <br /> Modern Advocates asks a different question: “How can we equip
          people to help themselves—and then empower them to help others?”{" "}
          <br />
          <br />
          We believe lasting change begins with education. When people gain
          knowledge, practical skills, and confidence, they become more
          resilient. As they grow stronger, they can encourage others facing
          similar challenges, creating a community where empowerment spreads
          from one person to the next. That is the future we are working to
          build.
        </p>
      </div>
    </section>
  )
}
