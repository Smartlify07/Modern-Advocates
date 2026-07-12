import { Geist_Mono, DM_Sans, Playfair_Display } from "next/font/google"
import { Providers } from "@/providers"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "@/shared/ui/sonner"
import { cn } from "@/shared/utils"

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
        playfairDisplayHeading.variable
      )}
    >
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
