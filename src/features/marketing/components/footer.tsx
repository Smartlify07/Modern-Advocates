export function Footer() {
  return (
    <footer className="bg-ma-text">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-8 sm:pt-28 lg:pt-32">
        <h2 className="select-none text-center font-heading text-[clamp(3rem,12vw,9rem)] font-extrabold leading-[0.85] tracking-tighter text-white/10">
          Modern
          <br />
          Advocates
        </h2>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Links
            </h3>
            <ul className="mt-4 space-y-3">
              {["Courses", "About", "Contact", "Login"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/50 transition-colors hover:text-white/80"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-white/50">
                hello@modernadvocates.com
              </li>
              <li className="text-sm text-white/50">+1 (555) 123-4567</li>
              <li className="text-sm text-white/50">
                123 Learning St, San Francisco, CA
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/50 transition-colors hover:text-white/80"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Modern Advocates. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
