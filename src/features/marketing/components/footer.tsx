import { GradientButton } from "@/shared/ui/gradient-button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Trainings", href: "/courses" },
  { label: "Donate", href: "/donation" },
  { label: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white text-ma-text">
      <div className="marketing-container relative min-h-125 pt-12.5 lg:pt-17.5">
        <div className="grid w-full justify-between gap-10 md:grid-cols-[0.9fr_0.6fr_1.5fr] lg:gap-10 xl:grid-cols-[254px_180px_388px] xl:justify-between xl:gap-[140px]">
          <section className="">
            <h2 className="marketing-header text-lg font-extrabold lg:text-2xl">
              Get in Touch
            </h2>
            <address className="mt-5 not-italic">
              <p className="text-base/[22px] tracking-[0%] whitespace-nowrap">
                2695 N. Military Trail Suite 22-1012
                <br />
                West Palm Beach,
                <br />
                FL 33409
              </p>
              <a
                href="mailto:modadvinc@gmail.com"
                className="mt-8 block text-base font-medium underline underline-offset-2"
              >
                modadvinc@gmail.com
              </a>
              <a
                href="tel:+15612367059"
                className="mt-5 block text-base font-medium underline underline-offset-2"
              >
                +(561) 236-7059
              </a>
            </address>
          </section>

          <nav aria-label="Footer navigation">
            <h2 className="marketing-header text-lg font-extrabold lg:text-2xl">
              Quick Links
            </h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base transition-colors hover:text-ma-text/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="">
            <h2 className="marketing-header text-lg font-extrabold lg:text-2xl">
              Join our News letter
            </h2>
            <p className="mt-5 text-base leading-normal xl:max-w-[387px]">
              Stay connected and informed: Join our newsletter for the latest
              updates, inspiration, and design insights.
            </p>

            <form className="mt-6 flex w-full items-center justify-between rounded-pill bg-ma-surface-2 py-2.5 pr-2.5 pl-5 lg:max-w-[374px]">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent text-base text-ma-text outline-none placeholder:text-muted-foreground"
              />

              <GradientButton className="h-11 p-[15px] text-xs hover:scale-[1.1]">
                Join
                <ArrowRight className="relative z-10 size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
              </GradientButton>
            </form>

            <p className="mt-8 text-sm leading-normal text-nowrap sm:text-base">
              &copy; All Rights Reserved. 2026, ModernAdvocates Inc
            </p>
          </section>
        </div>

        <p className="pointer-events-none mx-auto mt-10 bg-gradient-to-b from-ma-text from-[40%] to-ma-text/0 to-[74%] bg-clip-text text-center font-playfair text-[40px] leading-none font-extrabold whitespace-nowrap text-transparent select-none md:text-[100px] lg:absolute lg:top-[72%] lg:left-1/2 lg:-translate-x-[calc(1280px/2-124px)] xl:text-[124px] 2xl:max-w-[1100px] 2xl:-translate-x-[calc(1280px/2-116px)]">
          ModernAdvocates
        </p>
      </div>
    </footer>
  )
}
