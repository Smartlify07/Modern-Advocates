import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Languages,
  Layers,
  PlayCircle,
  Star,
  User,
} from "lucide-react"

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
  { title: "Week 2: AI Productivity & Prompting" },
  { title: "Week 3: Business Validation & Fast Monetization Planning" },
  { title: "Week 4: Branding & Digital Presence" },
  { title: "Week 5: Product & Service Creation" },
  { title: "Week 6: Marketing & Public Launch" },
  { title: "Week 7: Client Acquisition & Sales Systems" },
  { title: "Week 8: Revenue Optimization & Sustainability" },
  { title: "Week 9: Automation & Efficiency" },
  { title: "Week 10: Portfolio & Authority Building" },
  { title: "Week 11: Scaling Small Businesses" },
  { title: "Week 12: Demo Day & Graduation" },
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
  open = false,
}: {
  title: string
  topics?: string[]
  open?: boolean
}) {
  return (
    <details
      open={open}
      className="group rounded-2xl border border-[#d9d9d9] bg-white px-5 pt-[17px] pb-5 open:bg-[#f5f5f5]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <h3 className="text-base leading-normal font-bold text-ma-text">
          {title}
        </h3>
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[15px] border border-[#d9d9d9] bg-white">
          <ChevronDown
            className="size-3.5 group-open:hidden"
            aria-hidden="true"
          />
          <ChevronUp
            className="hidden size-3.5 group-open:block"
            aria-hidden="true"
          />
        </span>
      </summary>

      {topics ? (
        <div className="mt-4 text-[15px] leading-normal text-ma-text">
          <p>Topics:</p>
          <ul className="list-disc pl-5">
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </details>
  )
}

function TutorCard() {
  return (
    <article className="flex flex-col gap-5 rounded-2xl bg-[#f5f5f5] p-4 sm:flex-row">
      <div className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-[10px] sm:w-[190px]">
        <Image
          src="/figma-courses/tutor-maxwell.png"
          alt="Mr. Maxwell"
          fill
          sizes="190px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-1 text-ma-text">
          <h3 className="text-base leading-normal font-bold">Mr. Maxwell</h3>
          <p className="text-[15px] leading-normal">Software engineer</p>
        </div>

        <p className="text-[15px] leading-normal text-ma-text">
          With 10+ years of experience in ML engineering and applied AI, Mr
          Henry has worked with tech companies, universities, and startups to
          build real-world AI systems.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm leading-normal font-medium text-[#6b7280]">
          <span className="inline-flex items-center gap-1">
            <User className="size-5" aria-hidden="true" />
            210 students
          </span>
          <span className="inline-flex items-center gap-1">
            <Star
              className="size-5 fill-[#ff9d00] text-[#ff9d00]"
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 items-end gap-2.5">
          <Image
            src={review.image}
            alt={review.name}
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 text-ma-text">
            <h3 className="text-base leading-normal font-bold">
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
      <h2 className="text-2xl leading-normal font-extrabold text-ma-text">
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

        <Button
          asChild
          variant="outline"
          className="mt-6 h-[53px] w-full gap-2.5 rounded-[60px] border-[#e5e7eb] bg-white px-5 py-4 text-base font-semibold text-ma-text hover:bg-[#f5f5f5]"
        >
          <Link href="/signup">
            Enroll Now
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </aside>
  )
}

export function CourseDetailContentSection() {
  return (
    <section className="bg-white px-6 py-20 text-ma-text">
      <div className="mx-auto grid max-w-[1040px] gap-12 lg:grid-cols-[598px_335px] lg:items-start lg:justify-between">
        <div className="flex w-full max-w-[598px] flex-col gap-[30px]">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl leading-normal font-extrabold text-ma-text">
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
            <h2 className="text-2xl leading-normal font-extrabold text-ma-text">
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
            <h2 className="text-2xl leading-normal font-extrabold text-ma-text">
              Meet your tutor
            </h2>
            <TutorCard />
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-2xl leading-normal font-extrabold text-ma-text">
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
