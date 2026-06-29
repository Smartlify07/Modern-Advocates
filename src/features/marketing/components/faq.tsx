import { Plus } from "lucide-react"

const faqs = [
  "Who is ModernAdvocates Inc. for?",
  "Is the consultation really free?",
  "What kind of AI workforce training do you offer?",
  "Do I need any prior experience to join the training programs?",
  "How does ModernAdvocates help with healthcare resources?",
  "How can I support your mission?",
]

export function Faq() {
  return (
    <section id="faq" className="bg-white py-24 lg:px-25 lg:py-25 2xl:px-50">
      <div className="mx-auto grid gap-12 lg:grid-cols-[425px_1fr] lg:gap-[77px]">
        <div>
          <h2 className="max-w-[425px] font-sans text-[40px]/[60px] font-extrabold text-primary">
            Got questions? we&apos;ve got answers
          </h2>
          <p className="mt-7.5 max-w-[425px] text-[18px] leading-normal text-primary">
            We&apos;ve compiled answers to frequently asked questions to help
            you get started quickly and confidently.
          </p>
        </div>

        <div className="flex flex-col gap-[29px]">
          {faqs.map((question) => (
            <button
              key={question}
              type="button"
              aria-label={question}
              className="flex w-full items-start gap-4 rounded-3xl border border-[#d9d9d9] bg-white px-5 py-[30px] text-left text-primary transition-colors hover:border-ma-text/35"
            >
              <Plus
                className="size-[30px] shrink-0"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 text-[22px] leading-normal font-bold">
                {question}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
