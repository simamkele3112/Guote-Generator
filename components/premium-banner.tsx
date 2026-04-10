"use client"

import { Crown, Zap } from "lucide-react"

interface PremiumBannerProps {
  quotesUsed: number
  limit: number
}

export function PremiumBanner({ quotesUsed, limit }: PremiumBannerProps) {
  return (
    <div
      className="w-full rounded-3xl border border-amber-500/30 p-5"
      style={{
        background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.08) 100%)",
      }}
      role="complementary"
      aria-label="Premium upgrade offer"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
          <Crown className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-bold text-amber-300 font-sans">Go Premium</h2>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30 font-sans">
              POPULAR
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            {quotesUsed >= limit
              ? "You've used all your free quotes."
              : `${limit - quotesUsed} free quote${limit - quotesUsed !== 1 ? "s" : ""} remaining.`}{" "}
            Upgrade for unlimited access.
          </p>
        </div>
      </div>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-bold text-amber-950 transition-all duration-200 active:scale-95 hover:bg-amber-400 font-sans"
        aria-label="Upgrade to Premium"
        onClick={() => alert("Premium coming soon! Stay tuned.")}
      >
        <Zap className="h-4 w-4" aria-hidden="true" />
        Upgrade to Premium — Unlimited Quotes
      </button>

      <div className="mt-3 flex justify-center gap-4">
        {["Unlimited quotes", "2× XP boost", "Exclusive categories"].map((feature) => (
          <span key={feature} className="flex items-center gap-1 text-[11px] text-muted-foreground font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60" aria-hidden="true" />
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
}
