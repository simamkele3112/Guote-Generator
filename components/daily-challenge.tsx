"use client"

import { useState, useEffect } from "react"
import { Zap, CheckCircle2, Lock } from "lucide-react"

interface DailyChallenge {
  id: string
  title: string
  description: string
  category: string
  reward: string
  completed: boolean
}

interface DailyChallengeProps {
  onAccept?: (challengeId: string) => void
}

const DAILY_CHALLENGES = [
  {
    id: "category-explorer",
    title: "Category Explorer",
    description: "View quotes from 3 different categories",
    icon: "🗺️",
    reward: "+50 XP",
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
  },
  {
    id: "reflection-master",
    title: "Reflection Master",
    description: "Write reflections on 2 quotes",
    icon: "✨",
    reward: "+75 XP",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  },
  {
    id: "share-the-love",
    title: "Share the Love",
    description: "Share 2 quotes on social media",
    icon: "📢",
    reward: "+60 XP",
    color: "from-rose-500/20 to-pink-500/10 border-rose-500/30",
  },
]

export function DailyChallenge({ onAccept }: DailyChallengeProps) {
  const [selectedChallenge, setSelectedChallenge] = useState(0)
  const [challengesCompleted, setCompletesCompleted] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dailyChallengeCompletions")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          const today = new Date().toDateString()
          if (data.lastDate === today) {
            setCompletesCompleted(data.completed)
          } else {
            localStorage.setItem(
              "dailyChallengeCompletions",
              JSON.stringify({ lastDate: today, completed: [] })
            )
          }
        } catch {
          // Reset if parse fails
        }
      } else {
        localStorage.setItem(
          "dailyChallengeCompletions",
          JSON.stringify({ lastDate: new Date().toDateString(), completed: [] })
        )
      }
    }
  }, [])

  const challenge = DAILY_CHALLENGES[selectedChallenge]
  const isCompleted = challengesCompleted.includes(challenge.id)

  return (
    <div className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="font-sans font-semibold text-white">Today's Challenge</h3>
        </div>
        <span className="text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          {isCompleted ? "✓ Completed" : "In Progress"}
        </span>
      </div>

      {/* Challenge Card */}
      <div
        className={`rounded-xl border bg-gradient-to-br p-4 mb-4 transition-all ${challenge.color}`}
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">{challenge.icon}</div>
          <div className="flex-1">
            <h4 className="font-sans font-bold text-white mb-1">{challenge.title}</h4>
            <p className="text-sm text-white/80 mb-3">{challenge.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/60">Reward:</span>
              <span className="text-sm font-bold text-amber-300">{challenge.reward}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Action */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {DAILY_CHALLENGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedChallenge(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === selectedChallenge ? "w-6 bg-white/60" : "w-2 bg-white/20 hover:bg-white/30"
              }`}
              aria-label={`Challenge ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => onAccept?.(challenge.id)}
          disabled={isCompleted}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            isCompleted
              ? "opacity-50 cursor-not-allowed bg-white/5"
              : "bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/30"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Accept Challenge
            </>
          )}
        </button>
      </div>
    </div>
  )
}
