"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CATEGORIES = ["all", "success", "motivation", "discipline", "love", "faith", "life", "money", "student", "hustle", "work", "investing", "kingdom"] as const

type Category = (typeof CATEGORIES)[number]

interface CategoryFilterProps {
  selected: string
  onChange: (cat: string) => void
}

const categoryEmojis: Record<string, string> = {
  all: "✨",
  success: "🏆",
  motivation: "🔥",
  discipline: "⚡",
  love: "💜",
  faith: "🕊️",
  life: "🌿",
  money: "💎",
  student: "🎓",
  hustle: "💸",
  work: "💼",
  investing: "📈",
  kingdom: "🙏",
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <div className="w-full min-w-0">
      {/* Container with gradient glass effect */}
      <div className="relative rounded-xl border border-white/20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm overflow-hidden">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-6 bg-gradient-to-r from-background/80 to-transparent transition-opacity hover:from-background"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-white/70" />
          </button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-6 bg-gradient-to-l from-background/80 to-transparent transition-opacity hover:from-background"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-3.5 w-3.5 text-white/70" />
          </button>
        )}

        {/* Scrollable category row */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onLoad={checkScroll}
          className="flex overflow-x-auto scrollbar-hide"
          role="navigation"
          aria-label="Quote categories"
        >
          <div className="flex gap-1 px-1 py-1 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = selected === cat
              return (
                <button
                  key={cat}
                  onClick={() => onChange(cat)}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${cat}`}
                  className={`flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[11px] font-medium transition-all duration-200 capitalize whitespace-nowrap border font-sans min-h-[22px] flex-shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-pink-500 border-primary/50 text-white shadow-lg shadow-primary/20"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs">{categoryEmojis[cat]}</span>
                  <span>{cat}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
