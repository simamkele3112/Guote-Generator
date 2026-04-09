'use client'

import { useState, useEffect } from 'react'

type HighlightColor = 'yellow' | 'red' | 'green' | 'blue' | 'purple'

interface QuoteHighlight {
  quoteId: number
  color: HighlightColor
  timestamp: number
}

export function useHighlights() {
  const [highlights, setHighlights] = useState<Map<number, HighlightColor>>(new Map())

  // Load highlights from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('quoteHighlights')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const numericMap = new Map<number, HighlightColor>()
        for (const [key, value] of Object.entries(parsed)) {
          numericMap.set(parseInt(key, 10), value as HighlightColor)
        }
        setHighlights(numericMap)
      } catch {
        localStorage.setItem('quoteHighlights', '{}')
      }
    }
  }, [])

  const toggleHighlight = (quoteId: number, color: HighlightColor) => {
    setHighlights((prev) => {
      const newMap = new Map(prev)
      if (newMap.get(quoteId) === color) {
        newMap.delete(quoteId)
      } else {
        newMap.set(quoteId, color)
      }

      // Persist to localStorage
      const obj = Object.fromEntries(newMap)
      localStorage.setItem('quoteHighlights', JSON.stringify(obj))

      return newMap
    })
  }

  const getHighlight = (quoteId: number): HighlightColor | null => {
    return highlights.get(quoteId) || null
  }

  const getHighlightedQuotes = (color?: HighlightColor) => {
    const entries = Array.from(highlights.entries())
    if (color) {
      return entries.filter(([_, c]) => c === color).map(([id]) => id)
    }
    return entries.map(([id]) => id)
  }

  const clearAllHighlights = () => {
    setHighlights(new Map())
    localStorage.setItem('quoteHighlights', '{}')
  }

  return {
    highlights,
    toggleHighlight,
    getHighlight,
    getHighlightedQuotes,
    clearAllHighlights,
  }
}
