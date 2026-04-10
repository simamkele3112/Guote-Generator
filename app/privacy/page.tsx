"use client"

import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 px-4 py-8 safe-area-inset-top safe-area-inset-bottom">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-pink-500 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-purple-500 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* Back button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 active:scale-95"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>

        {/* Main card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8">
          {/* Header section */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-white/60">Last updated: April 2, 2026</p>
          </div>

          {/* Content sections */}
          <div className="space-y-6 text-white/80">
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-white">Introduction</h2>
              <p className="leading-relaxed">
                Welcome to QuoteApp. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we handle information in relation to your use of our app.
              </p>
            </section>

            {/* Information Collection */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-white">Information Collection</h2>
              <p className="leading-relaxed">
                QuoteApp does not directly collect, store, or transmit any personal data such as your name, email, phone number, or location. The app is designed to work entirely offline without requiring account creation or personal information submission.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-white">Third-Party Services</h2>
              <p className="leading-relaxed">
                QuoteApp may integrate with third-party services for sharing functionality (WhatsApp, Facebook, Twitter, etc.). When you use these features, you are subject to their respective privacy policies. We recommend reviewing their terms before sharing through these platforms.
              </p>
            </section>

            {/* User Rights */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-white">Your Rights</h2>
              <p className="leading-relaxed">
                Since we do not collect personal data, there is no personal information for us to access, modify, or delete. All your interactions within QuoteApp (favorites, quote history) are stored locally on your device and are never transmitted to our servers.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-white">Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy or our practices, please don&apos;t hesitate to reach out to us.
              </p>
              <a
                href="mailto:Simamkelen3112@gmail.com?subject=QuoteApp%20Inquiry&body=Hi%20Sima,%0A%0A"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-all hover:shadow-lg active:scale-95 min-h-[44px]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email Us
              </a>
            </section>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-white/60">
          <p>QuoteApp respects your privacy and keeps your data secure.</p>
        </div>
      </div>
    </main>
  )
}
