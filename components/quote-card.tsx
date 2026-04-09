"use client"

import { useState, useCallback } from "react"
import { Quote, Heart, Copy, Check, Download } from "lucide-react"
import { QuoteRating } from "./quote-rating"
import { ShareQuoteAsImageButton } from "./share-quote-image"
import { BibleInsightsCard } from "./bible-insights-card"
import { StudyTipsCard } from "./study-tips-card"
import { useHighlights } from "@/hooks/use-highlights"
import { categoryColors, categoryBadgeColors, CARD_THEMES } from "@/lib/category-colors"
import bibleInsightsData from "@/data/bible-insights.json"
import studyTipsData from "@/data/study-tips.json"

interface QuoteData {
  id: number
  text: string
  author: string
  category: string
}

interface QuoteCardProps {
  quote: QuoteData
  isAnimating: boolean
  isFavorite?: boolean
  onToggleFavorite?: () => void
  reflection?: string
  onReflectionChange?: (text: string) => void
  onCopyQuote?: () => void
  onDownloadQuote?: () => void
  viewMode?: "quote" | "bible" | "study"
  onViewModeChange?: (mode: "quote" | "bible" | "study") => void
  currentBibleInsight?: any
  bibleFavorite?: boolean
  onToggleBibleFavorite?: () => void
  currentStudyTip?: any
  studyFavorite?: boolean
  onToggleStudyFavorite?: () => void
  bibleReflection?: string
  onBibleReflectionChange?: (text: string) => void
  studyReflection?: string
  onStudyReflectionChange?: (text: string) => void
  isGolden?: boolean
  isQuoteOfDay?: boolean
}

// Confetti particle component
function ConfettiParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={style}
    />
  )
}

// Mini confetti burst on favorite
function useConfetti() {
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([])

  const burst = useCallback(() => {
    const colors = ["#ec4899", "#f472b6", "#fb7185", "#fda4af", "#fecdd3", "#a855f7", "#c084fc"]
    const newParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * 360
      const velocity = 40 + Math.random() * 30
      const radians = (angle * Math.PI) / 180
      const x = Math.cos(radians) * velocity
      const y = Math.sin(radians) * velocity
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 4 + Math.random() * 4
      const rotation = Math.random() * 360

      return {
        id: Date.now() + i,
        style: {
          left: "50%",
          top: "50%",
          width: size,
          height: size,
          backgroundColor: color,
          transform: `translate(-50%, -50%)`,
          animation: `confetti-burst 600ms ease-out forwards`,
          "--x": `${x}px`,
          "--y": `${y}px`,
          "--r": `${rotation}deg`,
        } as React.CSSProperties,
      }
    })

    setParticles(newParticles)
    setTimeout(() => setParticles([]), 700)
  }, [])

  return { particles, burst }
}

export function QuoteCard({ 
  quote, 
  isAnimating, 
  isFavorite = false, 
  onToggleFavorite, 
  reflection, 
  onReflectionChange, 
  onCopyQuote, 
  onDownloadQuote,
  viewMode = "quote",
  onViewModeChange,
  isGolden = false,
  isQuoteOfDay = false,
  currentBibleInsight,
  bibleFavorite = false,
  onToggleBibleFavorite,
  currentStudyTip,
  studyFavorite = false,
  onToggleStudyFavorite,
  bibleReflection,
  onBibleReflectionChange,
  studyReflection,
  onStudyReflectionChange
}: QuoteCardProps) {
  const [copied, setCopied] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [selectedThemeId, setSelectedThemeId] = useState<string>("violet")
  const { useHighlights: highlightsHook } = useHighlights()

  const activeTheme = CARD_THEMES.find((t) => t.id === selectedThemeId) ?? CARD_THEMES[0]
  // Use selected theme class; golden overrides both
  const cardGradientClass = isGolden
    ? "border-amber-400/70 from-amber-900/30 to-yellow-900/20 animate-golden-glow"
    : activeTheme.cardClass
  const badgeClass = categoryBadgeColors[quote.category] ?? "bg-primary/20 text-primary border-primary/30"
  const { particles, burst } = useConfetti()
  const [showBigHeart, setShowBigHeart] = useState(false)
  const [lastTap, setLastTap] = useState(0)

  // Self-contained canvas download using selected theme
  const handleDownload = useCallback(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1080
    canvas.height = 1080
    const ctx = canvas.getContext("2d")!
    const [c0, c1, c2, c3] = activeTheme.canvas

    // Background — 4-stop diagonal gradient
    const bg = ctx.createLinearGradient(0, 0, 1080, 1080)
    bg.addColorStop(0,    c0)
    bg.addColorStop(0.35, c1)
    bg.addColorStop(0.7,  c2)
    bg.addColorStop(1,    c3)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 1080, 1080)

    // Radial glow in top-right
    const glow = ctx.createRadialGradient(980, 120, 0, 980, 120, 400)
    glow.addColorStop(0,   activeTheme.accent + "55")
    glow.addColorStop(1,   activeTheme.accent + "00")
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 1080, 1080)

    // Second softer glow bottom-left
    const glow2 = ctx.createRadialGradient(80, 960, 0, 80, 960, 320)
    glow2.addColorStop(0, activeTheme.accent + "33")
    glow2.addColorStop(1, activeTheme.accent + "00")
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, 1080, 1080)

    // Frosted card background with rounded rect simulation
    ctx.fillStyle = "rgba(255,255,255,0.09)"
    const cx = 70, cy = 160, cw = 940, ch = 760
    const r = 40
    ctx.beginPath()
    ctx.moveTo(cx + r, cy)
    ctx.lineTo(cx + cw - r, cy)
    ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + r)
    ctx.lineTo(cx + cw, cy + ch - r)
    ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - r, cy + ch)
    ctx.lineTo(cx + r, cy + ch)
    ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - r)
    ctx.lineTo(cx, cy + r)
    ctx.quadraticCurveTo(cx, cy, cx + r, cy)
    ctx.closePath()
    ctx.fill()

    // Card border stroke
    ctx.strokeStyle = "rgba(255,255,255,0.18)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Category / theme name tag
    ctx.fillStyle = "rgba(255,255,255,0.12)"
    ctx.beginPath()
    ctx.roundRect(cx + 30, cy + 28, 220, 44, 22)
    ctx.fill()
    ctx.fillStyle = activeTheme.accent
    ctx.font = "600 22px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(quote.category.toUpperCase(), cx + 50, cy + 56)

    // Theme label (top right)
    ctx.fillStyle = "rgba(255,255,255,0.35)"
    ctx.font = "500 20px sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(activeTheme.name, cx + cw - 30, cy + 54)

    // Opening quote mark
    ctx.fillStyle = activeTheme.accent + "60"
    ctx.font = "bold 140px Georgia, serif"
    ctx.textAlign = "left"
    ctx.fillText("“", cx + 36, cy + 210)

    // Quote text wrapping
    ctx.fillStyle = "rgba(255,255,255,0.96)"
    ctx.font = "600 48px Georgia, serif"
    ctx.textAlign = "center"
    const words = quote.text.split(" ")
    let line = ""
    const wrapped: string[] = []
    const maxW = cw - 120
    for (const word of words) {
      const test = line + word + " "
      if (ctx.measureText(test).width > maxW && line) {
        wrapped.push(line.trim())
        line = word + " "
      } else {
        line = test
      }
    }
    wrapped.push(line.trim())
    const lh = 72
    const textBlockH = wrapped.length * lh
    const textStartY = cy + (ch - textBlockH - 120) / 2 + 80
    wrapped.forEach((l, i) => ctx.fillText(l, cx + cw / 2, textStartY + i * lh))

    // Divider line
    ctx.strokeStyle = activeTheme.accent + "80"
    ctx.lineWidth = 1.5
    const divY = cy + ch - 110
    ctx.beginPath()
    ctx.moveTo(cx + 80, divY)
    ctx.lineTo(cx + cw - 80, divY)
    ctx.stroke()

    // Author
    ctx.fillStyle = "rgba(255,255,255,0.65)"
    ctx.font = "500 34px Georgia, serif"
    ctx.textAlign = "center"
    ctx.fillText("— " + quote.author, cx + cw / 2, cy + ch - 58)

    // App watermark
    ctx.fillStyle = "rgba(255,255,255,0.25)"
    ctx.font = "400 22px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("QuoteApp", 540, 1048)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `quote-${activeTheme.id}-${quote.id}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, "image/png")
    onCopyQuote?.() // award XP via parent
  }, [quote, activeTheme, onCopyQuote])

  const handleFavoriteClick = () => {
    if (!isFavorite) {
      burst()
      setShowBigHeart(true)
      setTimeout(() => setShowBigHeart(false), 1000)
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([15, 20, 10])
    }
    onToggleFavorite?.()
  }

  // Double-tap to favorite (Instagram style)
  const handleDoubleTap = () => {
    const now = Date.now()
    if (now - lastTap < 300) {
      // Double tap detected
      if (!isFavorite && onToggleFavorite) {
        burst()
        onToggleFavorite()
        setShowBigHeart(true)
        setTimeout(() => setShowBigHeart(false), 1000)
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([15, 20, 10])
      }
    }
    setLastTap(now)
  }

  // Social proof — seeded from quote id for consistency
  const resonateCount = ((quote.id * 137 + 2341) % 8000) + 500
  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`

  return (
    <div className="w-full space-y-2">
      {/* Toggle Buttons - Quote, Bible Insights, Study Tips */}
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => onViewModeChange?.("quote")}
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
            viewMode === "quote"
              ? "bg-white/20 text-white border border-white/40"
              : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
          }`}
        >
          💬 Quote
        </button>
        <button
          onClick={() => onViewModeChange?.("bible")}
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
            viewMode === "bible"
              ? "bg-indigo-500/30 text-white border border-indigo-500/50"
              : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
          }`}
        >
          📖 Bible
        </button>
        <button
          onClick={() => onViewModeChange?.("study")}
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
            viewMode === "study"
              ? "bg-amber-500/30 text-white border border-amber-500/50"
              : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
          }`}
        >
          🧠 Study
        </button>
      </div>

      {/* Content based on view mode */}
      {viewMode === "quote" && (
    <div
      id="quote-card"
      onClick={handleDoubleTap}
      className={`relative w-full rounded-2xl border bg-gradient-to-br backdrop-blur-md p-3 shadow-2xl transition-all duration-500 cursor-pointer select-none ${
        cardGradientClass
      } ${
        isAnimating ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
      }`}
      role="article"
      aria-label="Quote card - double tap to favorite"
    >
      {/* Big heart animation on double-tap */}
      {showBigHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <Heart
            className="h-24 w-24 fill-pink-500 text-pink-500 animate-big-heart"
            aria-hidden="true"
          />
        </div>
      )}
      {/* Golden quote badge */}
      {isGolden && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/20 border border-amber-400/50 rounded-full px-2 py-0.5 pointer-events-none z-20">
          <span className="text-[10px] font-bold text-amber-300 tracking-wide">✨ RARE</span>
        </div>
      )}
      {/* Decorative quote icon */}
      <Quote
        className="absolute top-3 left-3 h-5 w-5 opacity-20 text-foreground"
        aria-hidden="true"
      />

      {/* Category badge + favorite button */}
      <div className="flex items-center justify-between mb-2">
        {onToggleFavorite ? (
          <div className="relative">
            <button
              onClick={handleFavoriteClick}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/20 active:scale-90"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-300 ${
                  isFavorite ? "fill-pink-400 text-pink-400 scale-110" : "text-white/60"
                }`}
                aria-hidden="true"
              />
            </button>
            {/* Confetti particles */}
            {particles.map((p) => (
              <ConfettiParticle key={p.id} style={p.style} />
            ))}
          </div>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {isQuoteOfDay && (
            <span className="flex items-center gap-0.5 rounded-full border border-amber-400/50 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              ✨ Today
            </span>
          )}
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize font-sans ${badgeClass}`}
          >
            {quote.category}
          </span>
        </div>
      </div>

      {/* Quote text */}
      <blockquote className="mb-1.5">
        <p className="font-serif text-xs leading-snug text-white/90 text-pretty font-medium">
          &ldquo;{quote.text}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <p className="text-[10px] text-center text-white/40 font-sans mb-0.5">— {quote.author}</p>

      {/* Actions + Rating — single compact row */}
      <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1.5">
        {/* Copy */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`)
            setCopied(true)
            onCopyQuote?.()
            setTimeout(() => setCopied(false), 2000)
          }}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 transition-all"
          aria-label="Copy quote"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        {/* Download */}
        <button
          onClick={handleDownload}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 transition-all"
          aria-label="Download quote as image"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
        {/* Share */}
        <ShareQuoteAsImageButton quote={quote} onShare={onCopyQuote} />
        <div className="flex-1" />
        {/* Star Rating inline */}
        <QuoteRating quoteId={quote.id} />
      </div>

      {/* Theme Colour Picker */}
      <div className="mt-1 flex items-center gap-1.5 pt-1 border-t border-white/10">
        <span className="text-[10px] text-white/40 font-sans uppercase tracking-wide flex-shrink-0">Theme</span>
        <div className="flex items-center gap-1.5">
          {CARD_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={(e) => { e.stopPropagation(); setSelectedThemeId(theme.id) }}
              title={theme.name}
              className={`h-5 w-5 rounded-full border-2 transition-all active:scale-90 ${
                selectedThemeId === theme.id
                  ? "border-white scale-110 shadow-[0_0_6px_2px_rgba(255,255,255,0.3)]"
                  : "border-transparent hover:border-white/50 hover:scale-105"
              }`}
              style={{ backgroundColor: theme.swatch }}
              aria-label={theme.name}
            />
          ))}
        </div>
        <span className="text-[10px] text-white/30 font-sans truncate flex-shrink-0">{activeTheme.name}</span>
      </div>

      {/* Reflection Section - Collapsible */}
      <div className="mt-0.5 pt-1 border-t border-white/10">
        <button
          onClick={() => setShowReflection(!showReflection)}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-white transition-colors"
        >
          <span>✨ {reflection ? "Your Reflection" : "Add Reflection"}</span>
          <span className={`transition-transform ${showReflection ? "rotate-180" : ""}`}>▼</span>
        </button>

        {showReflection && (
          <textarea
            value={reflection || ""}
            onChange={(e) => onReflectionChange?.(e.target.value)}
            placeholder="What does this quote mean to you?"
            className="w-full mt-1 rounded-lg bg-white/5 border border-white/20 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 resize-none font-sans"
            rows={2}
          />
        )}
      </div>
    </div>
      )}

      {/* Bible Insights View */}
      {viewMode === "bible" && currentBibleInsight && (
        <BibleInsightsCard 
          insight={currentBibleInsight} 
          isAnimating={isAnimating}
          isFavorite={bibleFavorite}
          onToggleFavorite={onToggleBibleFavorite}
          reflection={bibleReflection}
          onReflectionChange={onBibleReflectionChange}
        />
      )}

      {/* Study Tips View */}
      {viewMode === "study" && currentStudyTip && (
        <StudyTipsCard 
          tip={currentStudyTip} 
          isAnimating={isAnimating}
          isFavorite={studyFavorite}
          onToggleFavorite={onToggleStudyFavorite}
          reflection={studyReflection}
          onReflectionChange={onStudyReflectionChange}
        />
      )}
    </div>
  )
}
