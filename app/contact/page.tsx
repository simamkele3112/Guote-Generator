"use client"

import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { FormEvent, useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("https://formspree.io/f/xldejegq", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setSubmitStatus("success")
        e.currentTarget.reset()
        setTimeout(() => setSubmitStatus("idle"), 4000)
      } else {
        setSubmitStatus("error")
        setTimeout(() => setSubmitStatus("idle"), 4000)
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-white mb-2">Get in Touch</h1>
            <p className="text-white/70">Have feedback or questions? We'd love to hear from you!</p>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-all focus:border-primary/50 focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="Your name"
              />
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-all focus:border-primary/50 focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="your@email.com"
              />
            </div>

            {/* Subject field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/90 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-all focus:border-primary/50 focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="What's this about?"
              />
            </div>

            {/* Message field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-all focus:border-primary/50 focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            {/* Status messages */}
            {submitStatus === "success" && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                Oops! Something went wrong. Please try again.
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-pink-500 px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2 min-h-[52px]"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Alternative contact */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-white/70 mb-3">Or reach out directly:</p>
            <div className="space-y-2 text-white/80">
              <p>
                Email:{" "}
                <a href="mailto:Simamkelen3112@gmail.com" className="text-pink-300 hover:underline">
                  Simamkelen3112@gmail.com
                </a>
              </p>
              <p>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/smah_nkq?igsh=NHRvYjlyYzc3bWZz&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:underline"
                >
                  @smah_nkq
                </a>
              </p>
              <p>
                TikTok:{" "}
                <a
                  href="https://www.tiktok.com/@sima_nkq?_r=1&_t=ZS-95DDjR5viMb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:underline"
                >
                  @sima_nkq
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
