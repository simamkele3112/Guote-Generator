import { useState, useEffect, useCallback } from "react"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  target?: number
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const defaultAchievements: Achievement[] = [
    { id: "first_quote", name: "First Step", description: "View your first quote", icon: "🎯", unlocked: false },
    { id: "collector_5", name: "Collector", description: "Save 5 quotes", icon: "💎", unlocked: false },
    { id: "collector_25", name: "Curator", description: "Save 25 quotes", icon: "👑", unlocked: false },
    { id: "reflects_5", name: "Reflective", description: "Write 5 reflections", icon: "✨", unlocked: false },
    { id: "reflects_25", name: "Deep Thinker", description: "Write 25 reflections", icon: "🧠", unlocked: false },
    { id: "streak_7", name: "Week Warrior", description: "7-day streak", icon: "🔥", unlocked: false },
    { id: "streak_30", name: "Monthly Legend", description: "30-day streak", icon: "⚡", unlocked: false },
    { id: "all_categories", name: "Explorer", description: "Visit all categories", icon: "🗺️", unlocked: false },
    { id: "shares_5", name: "Sharer", description: "Share 5 quotes", icon: "📢", unlocked: false },
    { id: "reads_50", name: "Reader", description: "Read 50 quotes", icon: "📚", unlocked: false },
    { id: "reads_200", name: "Bookworm", description: "Read 200 quotes", icon: "📖", unlocked: false },
    { id: "power_hour", name: "Power Hour", description: "Read 10 quotes in one session", icon: "⚙️", unlocked: false },
  ]

  // Load achievements from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quoteAppAchievements")
      if (saved) {
        try {
          setAchievements(JSON.parse(saved))
        } catch (e) {
          setAchievements(defaultAchievements)
        }
      } else {
        setAchievements(defaultAchievements)
      }
    }
  }, [])

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements((prev) => {
      const updated = prev.map((ach) => {
        if (ach.id === achievementId && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() }
        }
        return ach
      })
      if (typeof window !== "undefined") {
        localStorage.setItem("quoteAppAchievements", JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  const updateProgress = useCallback((achievementId: string, progress: number, target: number) => {
    setAchievements((prev) => {
      const updated = prev.map((ach) => {
        if (ach.id === achievementId) {
          return { ...ach, progress, target }
        }
        return ach
      })
      if (typeof window !== "undefined") {
        localStorage.setItem("quoteAppAchievements", JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  const getUnlockedCount = useCallback(() => {
    return achievements.filter((a) => a.unlocked).length
  }, [achievements])

  return {
    achievements,
    unlockAchievement,
    updateProgress,
    getUnlockedCount,
  }
}
