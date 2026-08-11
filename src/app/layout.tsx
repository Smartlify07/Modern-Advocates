import { Geist_Mono, DM_Sans, Inter, Playfair_Display } from "next/font/google"
import { Providers } from "@/providers"

import "./globals.css"
import { Toaster } from "@/shared/ui/sonner"
import { cn } from "@/shared/utils"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modern Advocates",
  description:
    " Modern Advocates empowers people facing chronic illness, disability, and financial hardship with education, advocacy, AI skills, and practical opportunities to rebuild hope and independence.",
}

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

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
        inter.variable,
        playfairDisplayHeading.variable
      )}
    >
      <body>
        <Providers>{children}</Providers>
        <Toaster expand={true} />
      </body>
    </html>
  )
}
