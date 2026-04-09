"use client"

import { useState, useEffect } from "react"
import { Zap, Award } from "lucide-react"

interface EngagementStatsProps {
  xp: number
  level: number
  onStatsClick?: () => void
}

export function EngagementStats({ xp, level, onStatsClick }: EngagementStatsProps) {
  const [mounted, setMounted] = useState(false)
  const xpForNextLevel = (level + 1) * 100
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={onStatsClick}
      className="relative w-full rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-4 hover:border-white/30 hover:bg-white/10 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-400/20">
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-white/60 font-sans">Level {level}</p>
            <p className="font-sans font-bold text-white text-sm">{xp} XP</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20">
          <Award className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full bg-white/10 h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-300"
          style={{ width: `${xpProgress * 100}%` }}
        />
      </div>

      <p className="text-xs text-white/50 mt-2 font-sans">
        {xpForNextLevel - (xp % xpForNextLevel)} XP to Level {level + 1}
      </p>
    </button>
  )
}
