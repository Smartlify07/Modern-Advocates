"use client"

import Link from "next/link"
import { Mail, MessageCircle, HelpCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-ma-text">Support</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/contact"
          className="flex flex-col items-center gap-4 rounded-2xl border border-[#d9d9d9] bg-white p-8 text-center transition-colors hover:bg-gray-50"
        >
          <Mail className="size-10 text-ma-admin-primary" />
          <h2 className="text-lg font-semibold text-ma-text">Contact Us</h2>
          <p className="text-sm text-[#6b7280]">
            Get in touch with our support team
          </p>
        </Link>

        <Link
          href="/faq"
          className="flex flex-col items-center gap-4 rounded-2xl border border-[#d9d9d9] bg-white p-8 text-center transition-colors hover:bg-gray-50"
        >
          <HelpCircle className="size-10 text-ma-admin-primary" />
          <h2 className="text-lg font-semibold text-ma-text">FAQ</h2>
          <p className="text-sm text-[#6b7280]">
            Find answers to common questions
          </p>
        </Link>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#d9d9d9] bg-white p-8 text-center">
          <MessageCircle className="size-10 text-ma-admin-primary" />
          <h2 className="text-lg font-semibold text-ma-text">Live Chat</h2>
          <p className="text-sm text-[#6b7280]">
            Chat with us in real time (coming soon)
          </p>
        </div>
      </div>
    </div>
  )
}
