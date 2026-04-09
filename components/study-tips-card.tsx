"use client"

import { useState, useCallback } from "react"
import { Heart, Copy, Check, Download } from "lucide-react"
import { ShareQuoteAsImageButton } from "./share-quote-image"
import { categoryColors, categoryBadgeColors, CARD_THEMES } from "@/lib/category-colors"

interface StudyTip {
  id: number
  title: string
  summary: string
  lesson: string
  tip: string
  category: string
}

interface StudyTipsCardProps {
  tip: StudyTip
  isAnimating: boolean
  isFavorite?: boolean
  onToggleFavorite?: () => void
  reflection?: string
  onReflectionChange?: (text: string) => void
}

// Confetti for favorites
function ConfettiParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={style}
    />
  )
}

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

export function StudyTipsCard({ tip, isAnimating, isFavorite = false, onToggleFavorite, reflection, onReflectionChange }: StudyTipsCardProps) {
  const [copied, setCopied] = useState(false)
  const [showBigHeart, setShowBigHeart] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [selectedThemeId, setSelectedThemeId] = useState("sunset")
  const { particles, burst } = useConfetti()
  const activeTheme = CARD_THEMES.find((t) => t.id === selectedThemeId) ?? CARD_THEMES[0]
  const badgeClass = categoryBadgeColors[tip.category] ?? "bg-amber-500/20 text-amber-300 border-amber-500/30"

  const handleFavoriteClick = () => {
    if (!isFavorite) {
      burst()
      setShowBigHeart(true)
      setTimeout(() => setShowBigHeart(false), 1000)
    }
    onToggleFavorite?.()
  }

  return (
    <div
      className={`relative w-full rounded-2xl border bg-gradient-to-br backdrop-blur-md p-2.5 shadow-2xl transition-all duration-500 select-none ${activeTheme.cardClass} ${
        isAnimating ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
      }`}
      role="article"
      aria-label="Study tip card"
    >
      {/* Big heart animation on favorite */}
      {showBigHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <Heart
            className="h-24 w-24 fill-pink-500 text-pink-500 animate-big-heart"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Title and Favorite Button */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-serif text-sm font-bold text-white leading-tight flex-1 pr-2">{tip.title}</h3>
        {onToggleFavorite && (
          <div className="relative">
            <button
              onClick={handleFavoriteClick}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/20 active:scale-90"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all duration-300 ${
                  isFavorite ? "fill-pink-400 text-pink-400 scale-110" : "text-white/60"
                }`}
                aria-hidden="true"
              />
            </button>
            {particles.map((p) => (
              <ConfettiParticle key={p.id} style={p.style} />
            ))}
          </div>
        )}
      </div>

      {/* Category Badge */}
      <span className={`inline-block rounded-full border px-1.5 py-0 text-[9px] font-medium capitalize font-sans leading-5 mb-1 ${badgeClass}`}>
        {tip.category}
      </span>

      {/* Summary */}
      <p className="text-[10px] text-white/80 mb-1 leading-tight font-sans">{tip.summary}</p>

      {/* Why It Works */}
      <div className="mb-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
        <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide mb-0.5">Why It Works</p>
        <p className="text-[10px] text-white/80 leading-tight">{tip.lesson}</p>
      </div>

      {/* How To Apply */}
      <div className="mb-1">
        <p className="text-[9px] font-semibold text-white/50 uppercase mb-0.5">How To Apply</p>
        <p className="text-[10px] text-white leading-tight bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1 font-sans">
          {tip.tip}
        </p>
      </div>

      {/* Interactive Features - Same as Quote Card */}
      <div className="mt-1 space-y-1 px-0">
        {/* Buttons Row */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${tip.title}: ${tip.tip}`)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 transition-all"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>

          {/* Download Button */}
          <button
            onClick={() => {
              const canvas = document.createElement("canvas")
              canvas.width = 1080
              canvas.height = 1350
              const ctx = canvas.getContext("2d")!
              const [c0, c1, c2, c3] = activeTheme.canvas

              const bg = ctx.createLinearGradient(0, 0, 1080, 1350)
              bg.addColorStop(0,    c0)
              bg.addColorStop(0.35, c1)
              bg.addColorStop(0.7,  c2)
              bg.addColorStop(1,    c3)
              ctx.fillStyle = bg
              ctx.fillRect(0, 0, 1080, 1350)

              // Radial glow
              const glow = ctx.createRadialGradient(980, 140, 0, 980, 140, 420)
              glow.addColorStop(0, activeTheme.accent + "55")
              glow.addColorStop(1, activeTheme.accent + "00")
              ctx.fillStyle = glow
              ctx.fillRect(0, 0, 1080, 1350)

              // Frosted card
              ctx.fillStyle = "rgba(255,255,255,0.09)"
              const cardX = 70, cardY = 120, cardW = 940, cardH = 1110, r = 40
              ctx.beginPath()
              ctx.moveTo(cardX + r, cardY)
              ctx.lineTo(cardX + cardW - r, cardY)
              ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r)
              ctx.lineTo(cardX + cardW, cardY + cardH - r)
              ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH)
              ctx.lineTo(cardX + r, cardY + cardH)
              ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r)
              ctx.lineTo(cardX, cardY + r)
              ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY)
              ctx.closePath()
              ctx.fill()
              ctx.strokeStyle = "rgba(255,255,255,0.18)"
              ctx.lineWidth = 2
              ctx.stroke()

              const wrap = (text: string, maxW: number, font: string): string[] => {
                ctx.font = font
                const words = text.split(" ")
                const lines: string[] = []
                let line = ""
                for (const w of words) {
                  const test = line + w + " "
                  if (ctx.measureText(test).width > maxW && line) { lines.push(line.trim()); line = w + " " }
                  else line = test
                }
                if (line.trim()) lines.push(line.trim())
                return lines
              }

              let y = 200
              ctx.textAlign = "center"
              // Title
              ctx.fillStyle = "rgba(255,255,255,0.95)"
              ctx.font = "bold 56px Georgia, serif"
              ctx.fillText(tip.title, 540, y); y += 70
              // Category pill
              ctx.fillStyle = activeTheme.accent + "33"
              ctx.beginPath(); ctx.roundRect(cardX + 80, y - 28, cardW - 160, 48, 24); ctx.fill()
              ctx.fillStyle = activeTheme.accent
              ctx.font = "700 24px sans-serif"
              ctx.fillText("⚡  " + tip.category.toUpperCase(), 540, y + 12); y += 68
              // Divider
              ctx.strokeStyle = activeTheme.accent + "80"
              ctx.lineWidth = 1.5
              ctx.beginPath(); ctx.moveTo(cardX + 80, y); ctx.lineTo(cardX + cardW - 80, y); ctx.stroke()
              y += 40
              // Summary
              ctx.fillStyle = "rgba(255,255,255,0.78)"
              ctx.font = "italic 27px Georgia, serif"
              wrap(tip.summary, 820, "italic 27px Georgia, serif").forEach(l => { ctx.fillText(l, 540, y); y += 44 })
              y += 20
              // Why it works section
              ctx.fillStyle = activeTheme.accent + "cc"
              ctx.font = "700 20px sans-serif"
              ctx.fillText("💡  WHY IT WORKS", 540, y); y += 46
              ctx.fillStyle = "rgba(255,255,255,0.85)"
              ctx.font = "600 26px Georgia, serif"
              wrap(tip.lesson, 820, "600 26px Georgia, serif").forEach(l => { ctx.fillText(l, 540, y); y += 40 })
              y += 20
              // How to apply section
              ctx.fillStyle = activeTheme.accent + "cc"
              ctx.font = "700 20px sans-serif"
              ctx.fillText("🎯  HOW TO APPLY", 540, y); y += 46
              ctx.fillStyle = "rgba(255,255,255,0.90)"
              ctx.font = "italic 26px Georgia, serif"
              wrap(tip.tip, 820, "italic 26px Georgia, serif").forEach(l => { ctx.fillText(l, 540, y); y += 40 })
              // Watermark
              ctx.fillStyle = "rgba(255,255,255,0.25)"
              ctx.font = "400 22px sans-serif"
              ctx.fillText("QuoteApp", 540, 1310)

              canvas.toBlob((blob) => {
                if (!blob) return
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `study-${activeTheme.id}-${tip.id}.png`
                link.click()
                URL.revokeObjectURL(url)
              }, "image/png")
            }}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 transition-all font-sans"
            aria-label="Download tip as image"
          >
            <Download className="h-3 w-3" />
          </button>

          {/* Share as Image Button */}
          <ShareQuoteAsImageButton
            quote={{
              text: tip.tip,
              author: tip.title,
              category: tip.category
            }}
          />
        </div>

        {/* Theme picker */}
        <div className="flex items-center gap-1 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1">
            {CARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={(e) => { e.stopPropagation(); setSelectedThemeId(theme.id) }}
                title={theme.name}
                className={`h-4 w-4 rounded-full border-2 transition-all active:scale-90 ${
                  selectedThemeId === theme.id
                    ? "border-white scale-110 shadow-[0_0_6px_2px_rgba(255,255,255,0.3)]"
                    : "border-transparent hover:border-white/50 hover:scale-105"
                }`}
                style={{ backgroundColor: theme.swatch }}
                aria-label={theme.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reflection Section - Collapsible */}
      <div className="mt-1 pt-1 border-t border-white/10">
        <button
          onClick={() => setShowReflection(!showReflection)}
          className="w-full flex items-center justify-between py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hover:text-white transition-colors"
        >
          <span>✨ {reflection ? "Your Reflection" : "Add Reflection"}</span>
          <span className={`transition-transform ${showReflection ? "rotate-180" : ""}`}>▼</span>
        </button>
        {showReflection && (
          <textarea
            value={reflection || ""}
            onChange={(e) => onReflectionChange?.(e.target.value)}
            placeholder="How will you apply this tip?"
            className="w-full mt-0.5 rounded-lg bg-white/5 border border-white/20 px-2 py-1 text-[10px] text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-white/30 font-sans"
            rows={2}
          />
        )}
      </div>
    </div>
  )
}
