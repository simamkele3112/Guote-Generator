"use client"

import { useState, useEffect } from "react"
import { Heart, Settings, Zap, Gift } from "lucide-react"

interface BottomNavProps {
  favoritesCount: number
  onFavorites: () => void
  onStats: () => void
  onDonate: () => void
  onMore: () => void
}

export function BottomNav({ favoritesCount, onFavorites, onStats, onDonate, onMore }: BottomNavProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navItems = [
    { label: "Saved", icon: Heart, action: onFavorites, indicator: favoritesCount },
    { label: "Donate", icon: Gift, action: onDonate },
    { label: "Stats", icon: Zap, action: onStats },
    { label: "More", icon: Settings, action: onMore },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-gradient-to-t from-background to-background/80 backdrop-blur-xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around max-w-md mx-auto h-[52px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all hover:bg-white/5 rounded-lg active:bg-white/10"
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className="h-5 w-5 text-white/70 transition-colors group-active:text-primary" />
                {item.indicator !== undefined && item.indicator > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white">
                    {item.indicator > 9 ? "9+" : item.indicator}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-semibold text-white/60">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
