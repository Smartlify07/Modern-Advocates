"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Languages,
  Layers,
  PlayCircle,
  Star,
  User,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/shared/ui/button"

const modules = [
  {
    title: "Week 1: AI, Economic Mobility & Entrepreneurship",
    topics: [
      "Understanding AI in simple terms",
      "AI myths vs. practical use",
      "Wage income vs. asset income",
      "Entrepreneurship for underserved communities",
      "Neurodivergent strengths in business ownership",
      "Real-world examples of AI-assisted businesses",
      "Low-cost startup opportunities",
      "Beginner-friendly digital business models",
    ],
  },
  {
    title: "Week 2: AI Productivity & Prompting",
    topics: [
      "Crafting effective AI prompts",
      "Automating daily workflows with AI",
      "AI tools for task management",
      "Integrating AI into existing tools",
    ],
  },
  {
    title: "Week 3: Business Validation & Fast Monetization Planning",
    topics: [
      "Identifying market problems & opportunities",
      "Lean validation techniques",
      "Fast monetization strategies",
      "Building a minimum viable offer",
    ],
  },
  {
    title: "Week 4: Branding & Digital Presence",
    topics: [
      "Defining your brand identity",
      "Building a simple website",
      "Social media positioning",
      "Content creation fundamentals",
    ],
  },
  {
    title: "Week 5: Product & Service Creation",
    topics: [
      "Designing digital products",
      "Service packaging and pricing",
      "AI-assisted product development",
      "Testing and iterating your offer",
    ],
  },
  {
    title: "Week 6: Marketing & Public Launch",
    topics: [
      "Launch campaign planning",
      "Organic marketing channels",
      "Paid advertising basics",
      "Building launch momentum",
    ],
  },
  {
    title: "Week 7: Client Acquisition & Sales Systems",
    topics: [
      "Sales funnel fundamentals",
      "Lead generation strategies",
      "CRM and follow-up systems",
      "Closing techniques for beginners",
    ],
  },
  {
    title: "Week 8: Revenue Optimization & Sustainability",
    topics: [
      "Pricing strategy refinement",
      "Upselling and cross-selling",
      "Customer retention tactics",
      "Financial management basics",
    ],
  },
  {
    title: "Week 9: Automation & Efficiency",
    topics: [
      "Workflow automation tools",
      "AI chatbots for customer support",
      "Email marketing automation",
      "Analytics and performance tracking",
    ],
  },
  {
    title: "Week 10: Portfolio & Authority Building",
    topics: [
      "Creating a professional portfolio",
      "Publishing thought leadership content",
      "Speaking and networking opportunities",
      "Building social proof",
    ],
  },
  {
    title: "Week 11: Scaling Small Businesses",
    topics: [
      "Hiring and delegation basics",
      "Systems and SOPs for growth",
      "Expanding product lines",
      "Partnership and collaboration strategies",
    ],
  },
  {
    title: "Week 12: Demo Day & Graduation",
    topics: [
      "Presenting your business pitch",
      "Demo day preparation",
      "Graduation and next steps",
      "Community and alumni network",
    ],
  },
]

const reviews = [
  {
    text: "This course completely changed how I understand AI. The instructor broke down even the most complex topics-like neural networks and gradient descent-into simple, digestible lessons. The hands-on exercises helped me finally connect theory with practical implementation.",
    name: "Jhno Macklonar",
    role: "Medical doctor",
    image: "/figma-courses/reviewer-1.png",
  },
  {
    text: "This program reshaped the way I think about machine learning concepts. Topics that once felt intimidating-like model training and optimization-were explained in a clear, step-by-step way. The practical projects made everything click and helped me apply what I learned with confidence.",
    name: "Jhno Macklonar",
    role: "Medical doctor",
    image: "/figma-courses/reviewer-2.png",
  },
]

const courseInformation = [
  { label: "Duration:", value: "12 Weeks", icon: Clock },
  { label: "Lesson:", value: "25 Lessons", icon: PlayCircle },
  { label: "Level:", value: "Beginner", icon: Layers },
  { label: "Language:", value: "English", icon: Languages },
]

function CourseModule({
  title,
  topics,
  open: defaultOpen = false,
}: {
  title: string
  topics?: string[]
  open?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={`rounded-2xl border border-[#d9d9d9] px-5 pt-[17px] pb-5 transition-colors ${
        open ? "bg-[#f5f5f5]" : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <h3 className="text-sm/[100%] leading-normal font-bold text-ma-text sm:text-base">
          {title}
        </h3>
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[15px] border border-[#d9d9d9] bg-white">
          <ChevronDown
            className={`size-3.5 transition-transform duration-600 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {topics ? (
          <div className="mt-4 text-sm leading-normal text-ma-text sm:text-[15px]">
            <p>Topics:</p>
            <ul className="list-disc pl-5">
              {topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TutorCard() {
  return (
    <article className="flex gap-5 rounded-2xl bg-[#f5f5f5] p-4">
      <div className="relative h-[190px] min-w-[106px] shrink-0 overflow-hidden rounded-[10px] sm:w-[190px]">
        <Image
          src="/figma-courses/tutor-maxwell.png"
          alt="Mr. Maxwell"
          fill
          sizes="190px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-[22px]">
        <div className="flex flex-col gap-1 text-ma-text">
          <h3 className="text-base leading-normal font-bold">Mr. Maxwell</h3>
          <p className="text-xs leading-normal sm:text-[15px]">
            Software engineer
          </p>
        </div>

        <p className="text-xs leading-normal text-ma-text sm:text-[15px]">
          With 10+ years of experience in ML engineering and applied AI, Mr
          Henry has worked with tech companies, universities, and startups to
          build real-world AI systems.
        </p>

        <div className="flex flex-nowrap items-center gap-4 text-[10px] leading-normal font-medium text-nowrap text-[#6b7280] sm:text-sm lg:flex-wrap">
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5 sm:size-5" aria-hidden="true" />
            210 students
          </span>
          <span className="inline-flex items-center gap-1">
            <Star
              className="size-3.5 fill-[#ff9d00] text-[#ff9d00] sm:size-5"
              aria-hidden="true"
            />
            5.0 (100 reviews)
          </span>
        </div>
      </div>
    </article>
  )
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <article className="flex flex-col gap-[22px] rounded-2xl border border-[#d9d9d9] p-5">
      <p className="text-[15px] leading-normal text-ma-text">{review.text}</p>

      <div className="flex gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 items-end gap-2.5">
          <Image
            src={review.image}
            alt={review.name}
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 text-ma-text">
            <h3 className="text-base leading-normal font-bold text-nowrap">
              {review.name}
            </h3>
            <p className="text-[15px] leading-normal">{review.role}</p>
          </div>
        </div>

        <div className="flex items-center text-[#ff9d00]" aria-label="5 stars">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="size-6 fill-current" />
          ))}
        </div>
      </div>
    </article>
  )
}

function CourseInformationCard() {
  return (
    <aside className="w-full rounded-2xl border border-[#d9d9d9] bg-white px-4 pt-4 pr-3.5 pb-[25px] lg:sticky lg:top-8">
      <h2 className="leading/[100%]-normal text-xl font-extrabold text-ma-text sm:text-2xl">
        Course information
      </h2>

      <div className="mt-6 flex flex-col">
        {courseInformation.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4 py-0">
              <span className="inline-flex items-center gap-2 text-base leading-normal font-medium text-ma-text">
                <item.icon
                  className="size-5 shrink-0 text-[#6b7280]"
                  aria-hidden="true"
                />
                {item.label}
              </span>
              <span className="text-base leading-normal font-medium whitespace-nowrap text-ma-text">
                {item.value}
              </span>
            </div>

            {index < courseInformation.length - 1 ? (
              <div className="my-4 border-t border-dashed border-[#d9d9d9]" />
            ) : (
              <div className="mt-4 border-t border-dashed border-[#d9d9d9]" />
            )}
          </div>
        ))}

        <div className="group relative mt-6">
          <Button asChild className="w-full rounded-[60px]" variant={"outline"}>
            <Link
              href="/signup"
              className="flex h-[53px] w-full items-center justify-center gap-2.5 rounded-[60px] border border-[#e5e7eb] bg-white px-5 py-4 text-base font-semibold text-primary transition-colors duration-300 group-hover:border-transparent group-hover:bg-transparent"
            >
              Enroll Now
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

export function CourseDetailContentSection() {
  return (
    <section className="bg-white py-10 text-ma-text lg:py-20">
      <div className="mx-auto flex flex-col-reverse gap-12 px-4 lg:grid lg:grid-cols-[598px_335px] lg:items-start lg:justify-between lg:px-25 2xl:px-50">
        <div className="flex w-full max-w-[598px] flex-col gap-[30px]">
          <section className="flex flex-col gap-4">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Course overview
            </h2>
            <p className="text-base leading-normal text-ma-text">
              This program is designed to support different learning styles and
              reduce overwhelm. We use flexible teaching methods, visual tools,
              AI supports, and step-by-step systems so participants can learn in
              ways that work best for them.
            </p>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Course Module
            </h2>
            <div className="flex flex-col gap-4">
              {modules.map((module, index) => (
                <CourseModule
                  key={module.title}
                  title={module.title}
                  topics={module.topics}
                  open={index === 0}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="/[100%]leading-normal text-xl font-extrabold text-ma-text sm:text-2xl">
              Meet your tutor
            </h2>
            <TutorCard />
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-xl/[100%] leading-normal font-extrabold text-ma-text sm:text-2xl">
              Student review of this course
            </h2>
            {reviews.map((review) => (
              <ReviewCard key={review.text} review={review} />
            ))}
          </section>
        </div>

        <CourseInformationCard />
      </div>
    </section>
  )
}
