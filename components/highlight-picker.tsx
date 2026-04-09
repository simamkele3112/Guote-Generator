'use client'

import { useState } from 'react'
import { Highlighter, X } from 'lucide-react'

type HighlightColor = 'yellow' | 'red' | 'green' | 'blue' | 'purple'

interface HighlightPickerProps {
  quoteId: number
  currentColor: HighlightColor | null
  onColorSelect: (color: HighlightColor) => void
}

const colors: { color: HighlightColor; label: string; bgClass: string; colorClass: string }[] = [
  { color: 'yellow', label: 'Important', bgClass: 'bg-yellow-400', colorClass: 'hover:ring-yellow-400' },
  { color: 'red', label: 'Urgent', bgClass: 'bg-red-400', colorClass: 'hover:ring-red-400' },
  { color: 'green', label: 'Inspiring', bgClass: 'bg-green-400', colorClass: 'hover:ring-green-400' },
  { color: 'blue', label: 'Interesting', bgClass: 'bg-blue-400', colorClass: 'hover:ring-blue-400' },
  { color: 'purple', label: 'Personal', bgClass: 'bg-purple-400', colorClass: 'hover:ring-purple-400' },
]

export function HighlightPicker({ quoteId, currentColor, onColorSelect }: HighlightPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentColorData = colors.find((c) => c.color === currentColor)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
          currentColor
            ? 'bg-white/20 border border-white/30 text-white'
            : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/15'
        }`}
      >
        <Highlighter className="h-3 w-3" />
        {currentColor && currentColorData && (
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${currentColorData.bgClass}`} />
            <span className="hidden sm:inline text-xs font-medium">{currentColorData.label}</span>
          </div>
        )}
        {!currentColor && <span className="hidden sm:inline text-xs font-medium">Highlight</span>}
      </button>

      {isOpen && (
        <>
          {/* Overlay to close */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Color Picker Dropdown - Above the button */}
          <div className="absolute bottom-full right-0 z-50 mb-2 p-3 rounded-lg border border-white/20 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Pick a mood</p>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto text-white/50 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Color circles grid */}
            <div className="grid grid-cols-5 gap-2">
              {colors.map(({ color, label, bgClass, colorClass }) => (
                <button
                  key={color}
                  onClick={() => {
                    onColorSelect(color)
                    setIsOpen(false)
                  }}
                  title={label}
                  className={`w-8 h-8 rounded-full ${bgClass} transition-all ring-2 ring-offset-2 ring-offset-transparent hover:ring-offset-white/20 ${
                    currentColor === color ? 'ring-white ring-offset-white/30 scale-110' : 'ring-white/20'
                  } hover:scale-110 ${colorClass}`}
                  aria-label={`Highlight as ${label}`}
                />
              ))}

              {/* Remove highlight option */}
              {currentColor && (
                <button
                  onClick={() => {
                    // Remove highlight by selecting the same color again
                    onColorSelect(currentColor)
                    setIsOpen(false)
                  }}
                  title="Remove highlight"
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center text-xs font-bold text-white/70"
                  aria-label="Remove highlight"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Label info */}
            <p className="text-xs text-white/50 mt-2 text-center">
              {currentColor ? `Marked as ${currentColorData?.label}` : 'Select a mood...'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

