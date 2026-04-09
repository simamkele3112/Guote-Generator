"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

interface QuoteRatingProps {
  quoteId: number
  onRate?: (rating: number) => void
  initialRating?: number
}

export function QuoteRating({ quoteId, onRate, initialRating = 0 }: QuoteRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`quote_rating_${quoteId}`)
      if (saved) {
        const rate = parseInt(saved, 10)
        setRating(rate)
      }
    }
  }, [quoteId])

  const handleRate = (value: number) => {
    setRating(value)
    setSaved(true)
    onRate?.(value)

    if (typeof window !== "undefined") {
      localStorage.setItem(`quote_rating_${quoteId}`, value.toString())
    }

    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`h-4 w-4 transition-all ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/30 hover:text-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {saved && <span className="text-xs text-green-400 font-sans">✓ Saved</span>}
      {rating > 0 && !saved && <span className="text-xs text-white/60 font-sans">{rating} stars</span>}
    </div>
  )
}
