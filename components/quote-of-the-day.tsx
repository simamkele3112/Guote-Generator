"use client"

import { useState, useEffect } from "react"
import { Sun, ChevronRight } from "lucide-react"

interface QuoteOfTheDayProps {
  quote: {
    id: number
    text: string
    author: string
    category: string
  }
  onViewQuote?: () => void
}

export function QuoteOfTheDay({ quote, onViewQuote }: QuoteOfTheDayProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div
      className={`relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm p-5 mb-6 cursor-pointer transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      onClick={onViewQuote}
      role="article"
      aria-label="Quote of the day"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />

      <div className="relative flex items-start gap-3">
        {/* Sun icon */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20">
            <Sun className="h-5 w-5 text-amber-400 animate-spin-slow" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1 font-sans">
            ✨ Quote of the Day
          </p>
          <p className="font-serif text-sm leading-relaxed text-white/90 line-clamp-2 mb-2">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-xs text-white/60 font-sans">— {quote.author}</p>
        </div>

        <div className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/60 transition-colors" />
        </div>
      </div>
    </div>
  )
}
