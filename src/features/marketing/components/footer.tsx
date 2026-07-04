import { ArrowRight } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Donate", href: "/donation" },
]

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white text-ma-text">
      <div className="relative mx-auto min-h-125 px-4 pt-12.5 lg:max-w-7xl lg:px-25 lg:pt-17.5 2xl:max-w-360 2xl:px-50">
        <div className="grid gap-10 md:grid-cols-[0.9fr_0.6fr_1.5fr] lg:gap-10 xl:grid-cols-[254px_180px_1fr] xl:gap-[125px]">
          <section className="">
            <h2 className="font-sans text-lg font-extrabold lg:text-2xl">
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
            <h2 className="font-sans text-lg font-extrabold lg:text-2xl">
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
            <h2 className="font-sans text-lg font-extrabold lg:text-2xl">
              Join our News letter
            </h2>
            <p className="mt-5 text-sm leading-normal xl:max-w-[387px]">
              Stay connected and informed: Join our newsletter for the latest
              updates, inspiration, and design insights.
            </p>

            <form className="mt-6 flex w-full items-center justify-between rounded-[60px] bg-[#f5f5f5] py-2.5 pr-2.5 pl-5 lg:max-w-[374px]">
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
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[60px] bg-ma-text px-[15px] py-3 text-[12.31px] font-semibold text-white transition-transform duration-300 hover:scale-[1.1]"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Join
                  <ArrowRight
                    className="size-[15px] transition-transform duration-300 group-hover:rotate-[-30deg]"
                    aria-hidden="true"
                  />
                </span>
                <div className="pointer-events-none absolute inset-0 rounded-[60px] bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </button>
            </form>

            <p className="mt-8 text-sm leading-normal sm:text-base">
              &copy; All Rights Reserved. 2026, ModernAdvocates Inc
            </p>
          </section>
        </div>

        <p className="pointer-events-none mt-10 text-center bg-gradient-to-b from-ma-text from-[40%] to-ma-text/0 to-[74%] bg-clip-text font-heading text-[40px] leading-none font-extrabold whitespace-nowrap text-transparent select-none lg:absolute lg:left-1/2 lg:-translate-x-[calc(1280px/2-100px)] lg:text-[100px] xl:text-[124px] 2xl:-translate-x-[calc(1280px/2-116px)]">
          ModernAdvocates
        </p>
      </div>
    </footer>
  )
}
