import { ArrowRight } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "#courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Donate", href: "/donation" },
]

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white text-ma-text">
      <div className="relative mx-auto min-h-[500px] max-w-[1040px] px-6 pt-[70px]">
        <div className="grid gap-12 md:grid-cols-[254px_180px_1fr] md:gap-[100px] lg:gap-[120px]">
          <section>
            <h2 className="font-heading text-2xl font-extrabold">
              Get in Touch
            </h2>
            <address className="mt-5 not-italic">
              <p className="text-base leading-normal">
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
            <h2 className="font-heading text-2xl font-extrabold">
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

          <section>
            <h2 className="font-heading text-2xl font-extrabold">
              Join our News letter
            </h2>
            <p className="mt-5 max-w-[387px] text-sm leading-normal">
              Stay connected and informed: Join our newsletter for the latest
              updates, inspiration, and design insights.
            </p>

            <form className="mt-6 flex w-full max-w-[374px] items-center justify-between rounded-[60px] bg-[#f5f5f5] py-2.5 pr-2.5 pl-5">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent text-base text-ma-text outline-none placeholder:text-[#6b7280]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-ma-text px-[15px] py-3 text-[12.31px] font-semibold text-white transition-colors hover:bg-ma-text/90"
              >
                Join
                <ArrowRight className="size-[15px]" aria-hidden="true" />
              </button>
            </form>

            <p className="mt-8 text-base leading-normal">
              &copy; All Rights Reserved. 2026, ModernAdvocates Inc
            </p>
          </section>
        </div>

        <p className="pointer-events-none absolute top-[370px] left-1/2 -translate-x-1/2 bg-gradient-to-b from-ma-text from-[40%] to-ma-text/0 to-[74%] bg-clip-text font-heading text-[clamp(4.8rem,12vw,7.75rem)] leading-none font-extrabold whitespace-nowrap text-transparent select-none">
          ModernAdvocates
        </p>
      </div>
    </footer>
  )
}
