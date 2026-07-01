"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Who is ModernAdvocates Inc. for?",
    answer:
      "ModernAdvocates Inc. serves low-to-moderate income individuals, caregivers, and families navigating health challenges or career transitions who need practical AI guidance and human-centered support.",
  },
  {
    question: "Is the consultation really free?",
    answer:
      "Yes, our initial consultation is completely free with no obligation. We believe everyone deserves access to guidance before making any commitment.",
  },
  {
    question: "What kind of AI workforce training do you offer?",
    answer:
      "We offer hands-on training in AI-powered tools, workflow automation, and digital skills designed for real-world application — no tech background required.",
  },
  {
    question: "Do I need any prior experience to join the training programs?",
    answer:
      "Not at all. Our programs are built for beginners and meet you where you are. We provide step-by-step guidance and ongoing support throughout your learning journey.",
  },
  {
    question: "How does ModernAdvocates help with healthcare resources?",
    answer:
      "We help you navigate the healthcare system by providing guidance on accessing care, understanding your options, and using AI tools to advocate for your health.",
  },
  {
    question: "How can I support your mission?",
    answer:
      "You can support our mission by donating, volunteering your expertise, or spreading the word. Every contribution helps us reach more individuals in need.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="bg-white py-12.5 lg:py-25">
      <div className="mx-auto max-w-360 px-4 lg:px-25 2xl:px-50">
        <div className="grid gap-12 lg:grid-cols-[425px_1fr] lg:gap-[77px]">
          <div>
            <h2 className="max-w-[425px] font-sans text-[28px]/[100%] font-extrabold text-primary lg:text-[40px]/[60px] lg:tracking-[-5%]">
              Got questions? we&apos;ve got answers
            </h2>
            <p className="mt-7.5 max-w-[425px] text-base leading-normal text-primary lg:text-[18px]">
              We&apos;ve compiled answers to frequently asked questions to help
              you get started quickly and confidently.
            </p>
          </div>

          <div className="flex flex-col gap-[29px]">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-3xl border border-[#d9d9d9] bg-white p-5 transition-colors hover:border-ma-text/35 lg:py-7.5"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-4 text-left text-primary"
                >
                  <Plus
                    className={`size-[30px] shrink-0 transition-transform duration-600 ${
                      openIndex === i ? "rotate-90" : ""
                    }`}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 text-lg leading-normal font-bold lg:text-[22px]">
                    {faq.question}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="pt-4 text-sm leading-normal text-ma-text/80 lg:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
