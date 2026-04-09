"use client"

import { Sparkles, Zap, Eye, BarChart3, CheckCircle2, Flame, Shield, Star, Infinity, Image } from "lucide-react"

interface PremiumFeaturesProps {
  isPremium?: boolean
  onUpgrade?: () => void
  adsSeenCount?: number
  itemsUsed?: number
  freeLimit?: number
}

const FREE_BENEFITS = [
  { icon: Eye,      title: "Ad-Free Forever",           description: "No more ads interrupting your focus. Clean, pure inspiration." },
  { icon: Infinity, title: "Unlimited Everything",       description: "All quotes, Bible insights & study tips with zero daily cap." },
  { icon: Zap,      title: "Permanent 2× XP Boost",    description: "Every quote, insight and tip earns double XP — level up twice as fast." },
  { icon: Flame,    title: "Streak Freeze",              description: "Broke your streak? Use a free freeze once a week to protect it." },
  { icon: BarChart3,title: "Advanced Stats & Goals",    description: "Unlock the full stats tab: content breakdown, engagement score, personal goals." },
  { icon: Star,     title: "Golden Quote Bonus XP",     description: "When a rare golden quote appears, premium users earn 3× the XP bonus." },
  { icon: Image,    title: "High-Quality Image Export", description: "Download quotes as 1080px images — perfect for Instagram & WhatsApp." },
  { icon: Shield,   title: "Early Feature Access",       description: "Be the first to get new categories, themes, and app updates." },
]

export function PremiumFeatures({
  isPremium = false,
  onUpgrade,
  adsSeenCount = 0,
  itemsUsed = 0,
  freeLimit = 20,
}: PremiumFeaturesProps) {
  const usedPct = Math.round((itemsUsed / freeLimit) * 100)

  return (
    <div className="space-y-5">

      {/* Hero banner */}
      <div className={`p-5 rounded-2xl border ${
        isPremium
          ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30"
          : "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20"
      }`}>
        {isPremium ? (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-green-400 text-lg leading-tight">Premium Active ✨</p>
              <p className="text-xs text-white/60 mt-0.5">Full access · No ads · 2× XP active</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-white text-lg leading-tight">Upgrade to Premium</p>
                <p className="text-xs text-white/60 mt-0.5">R30/month · Cancel anytime</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-amber-400">R30</p>
                <p className="text-[10px] text-white/40">/month</p>
              </div>
            </div>

            {/* Usage warning */}
            {itemsUsed > 0 && (
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs text-white/60">
                  <span>{itemsUsed} of {freeLimit} free items used</span>
                  <span className={usedPct >= 80 ? "text-red-400 font-semibold" : ""}>{usedPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      usedPct >= 80 ? "bg-red-400" : usedPct >= 50 ? "bg-amber-400" : "bg-green-400"
                    }`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>
            )}

            {adsSeenCount > 0 && (
              <p className="text-xs text-white/50 mb-3">
                🙈 You've seen <span className="text-amber-400 font-semibold">{adsSeenCount} ad{adsSeenCount !== 1 ? "s" : ""}</span> today — go premium to remove them all.
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Or save with R360/year (Best Value)</span>
            </div>
          </>
        )}
      </div>

      {/* Benefits list */}
      <div className="space-y-2.5">
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">What you get</p>
        {FREE_BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div
              key={index}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                isPremium
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isPremium
                  ? <CheckCircle2 className="h-4.5 w-4.5 text-green-400" />
                  : <Icon className="h-4 w-4 text-amber-400" />
                }
              </div>
              <div>
                <p className="font-semibold text-white text-sm leading-tight">{benefit.title}</p>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {!isPremium && (
        <div className="space-y-2">
          <button
            onClick={onUpgrade}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base transition-all hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
          >
            Upgrade — R30/month
          </button>
          <p className="text-center text-xs text-white/30">South African payments · Secure · Cancel anytime</p>
        </div>
      )}
    </div>
  )
}
