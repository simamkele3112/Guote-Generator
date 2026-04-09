"use client"

import { useState } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { QuoteGenerator } from "@/components/quote-generator"

export default function HomePage() {
  const [started, setStarted] = useState(false)

  return (
    <>
      {!started && (
        <OnboardingScreen onStart={() => setStarted(true)} />
      )}
      {/* Always render generator but hide until started for instant load */}
      <div
        className={`transition-opacity duration-500 ${started ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!started}
      >
        <QuoteGenerator />
      </div>
    </>
  )
}
