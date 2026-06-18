import { HeroHeader } from "@/components/hero-header"
import { HeroContent } from "@/components/hero-content"
import { HeroCta } from "@/components/hero-cta"
import { HeroTrustedBy } from "@/components/hero-trusted-by"
import { SocialProof } from "@/components/social-proof"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FeaturedCourses } from "@/components/featured-courses"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { Faq } from "@/components/faq"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-gradient-to-b from-white to-ma-bg text-ma-text">
      <HeroHeader />

      <section className="relative pt-4 pb-28 sm:pb-36 lg:pb-44">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-48 -right-48 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-blue-200/20 to-violet-200/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-48 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-cyan-200/15 to-blue-200/15 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 h-32 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ma-text/10 to-transparent" />
        </div>

        <HeroContent />

        <div className="relative z-10 mx-auto mt-10 flex max-w-6xl flex-col items-center px-6 sm:mt-12">
          <HeroCta />
        </div>

        <div className="relative z-10 mx-auto mt-16 max-w-6xl px-6 sm:mt-20">
          <HeroTrustedBy />
        </div>
      </section>

      <SocialProof />
      <WhyChooseUs />
      <FeaturedCourses />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <div className="mx-6">
        <CtaSection />
      </div>
      <Footer />
    </main>
  )
}
