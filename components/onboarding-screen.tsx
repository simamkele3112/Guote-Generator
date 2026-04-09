"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, Share2, Smartphone, Brain, ChevronRight } from "lucide-react"

interface OnboardingScreenProps {
  onStart: () => void
}

const slides = [
  {
    icon: Sparkles,
    title: "Inspiring Content",
    subtitle: "three ways",
    description: "Get motivated with quotes, Bible insights, and study tips tailored for you",
  },
  {
    icon: Sparkles,
    title: "Generate Quotes",
    subtitle: "instantly",
    description: "Create powerful quotes based on your mood and mindset",
  },
  {
    icon: Share2,
    title: "Share with Ease",
    subtitle: "anywhere",
    description: "Send via WhatsApp, Instagram, TikTok, Facebook, and more",
  },
  {
    icon: Smartphone,
    title: "Access Anytime",
    subtitle: "on any device",
    description: "Use on phone or tablet anytime, anywhere",
  },
  {
    icon: Brain,
    title: "Fuel Your Mind",
    subtitle: "daily",
    description: "Stay inspired and motivated with consistent daily content",
  },
]

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  const [visible, setVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next")
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setSlideDirection(index > currentSlide ? "next" : "prev")
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 400)
  }, [currentSlide, isAnimating])

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1)
    }
  }, [currentSlide, goToSlide])

  const isLastSlide = currentSlide === slides.length - 1
  const CurrentIcon = slides[currentSlide].icon

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-12 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 30%, #7c3aed 60%, #db2777 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-60px] h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

      {/* Header with Skip */}
      <div className="relative z-10 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-pink-300" aria-hidden="true" />
          <span className="font-serif text-xl font-bold text-white">QuoteApp</span>
        </div>
        {!isLastSlide && (
          <button
            onClick={onStart}
            className="text-sm font-medium text-white/60 transition-colors hover:text-white font-sans"
            aria-label="Skip onboarding"
          >
            Skip
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full max-w-sm">
        <div
          key={currentSlide}
          className={`flex flex-col items-center text-center transition-all duration-400 ${
            isAnimating
              ? slideDirection === "next"
                ? "translate-x-4 opacity-0"
                : "-translate-x-4 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {/* Icon */}
          <div className="mb-8 flex items-center justify-center rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/20 shadow-xl">
            <CurrentIcon className="h-12 w-12 text-pink-300" aria-hidden="true" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold text-white mb-1 drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>
          <p className="font-serif text-2xl font-medium text-pink-300 mb-4">
            {slides[currentSlide].subtitle}
          </p>

          {/* Description */}
          <p className="text-center text-white/70 text-lg leading-relaxed max-w-xs font-sans">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Bottom section: dots + buttons */}
      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        {/* Progress dots */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Onboarding slides">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              role="tab"
              aria-selected={index === currentSlide}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Primary action button */}
        {isLastSlide ? (
          <button
            onClick={onStart}
            className="w-full max-w-xs rounded-2xl bg-white py-4 text-lg font-semibold text-violet-800 shadow-2xl transition-all duration-200 active:scale-95 hover:bg-white/90 font-sans"
            aria-label="Get started with QuoteApp"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={nextSlide}
            className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-white/20 border border-white/30 py-4 text-lg font-semibold text-white shadow-xl backdrop-blur-sm transition-all duration-200 active:scale-95 hover:bg-white/30 font-sans"
            aria-label="Go to next slide"
          >
            Next
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        <p className="text-xs text-white/40 font-sans">Free to use · No account needed</p>
      </div>
    </div>
  )
}
