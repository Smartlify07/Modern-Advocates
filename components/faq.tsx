"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Who are these courses for?",
    answer:
      "Our courses are designed for professionals, entrepreneurs, students, and lifelong learners seeking practical skills and measurable results.",
  },
  {
    question: "How long do I have access?",
    answer:
      "Most courses include lifetime access to learning materials and updates.",
  },
  {
    question: "Do I receive a certificate?",
    answer:
      "Yes. Certificates are awarded upon successful completion of eligible courses.",
  },
  {
    question: "Can I learn at my own pace?",
    answer:
      "Absolutely. You can access course materials whenever it suits your schedule.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-ma-bg py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-ma-text sm:text-5xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold text-ma-text transition-colors hover:text-ma-text/70 sm:px-8 sm:text-base"
                >
                  {faq.question}
                  <ChevronDown
                    className={`size-4 shrink-0 text-ma-text/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="border-t border-ma-text/5 px-6 py-5 text-sm leading-relaxed text-ma-text/60 sm:px-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
