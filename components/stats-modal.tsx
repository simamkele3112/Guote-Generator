"use client"

import { useState } from "react"
import { X, Trophy, Flame, BookOpen, Heart, Lightbulb, Star } from "lucide-react"
import { Achievement } from "@/hooks/use-achievements"

interface StatsModalProps {
  onClose: () => void
  stats: {
    quotesRead: number
    bibleInsightsRead: number
    studyTipsRead: number
    favoriteCount: number
    reflectionCount: number
    streak: number
    shareCount: number
    xp: number
    isPremium?: boolean
    totalTimeSpent?: number
  }
  achievements: Achievement[]
}

export function StatsModal({ onClose, stats, achievements }: StatsModalProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "advanced" | "achievements">("stats")
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const total = stats.quotesRead + stats.bibleInsightsRead + stats.studyTipsRead
  const totalMax = 250
  const level = Math.floor(stats.xp / 100) + 1
  const xpInLevel = stats.xp % 100
  const xpToNextLevel = 100

  // Derived advanced stats
  const mostUsedLabel =
    stats.quotesRead >= stats.bibleInsightsRead && stats.quotesRead >= stats.studyTipsRead
      ? "💬 Quotes"
      : stats.bibleInsightsRead >= stats.studyTipsRead
      ? "📖 Bible Insights"
      : "🧠 Study Tips"

  const quotePct = total > 0 ? Math.round((stats.quotesRead / total) * 100) : 0
  const biblePct = total > 0 ? Math.round((stats.bibleInsightsRead / total) * 100) : 0
  const studyPct = total > 0 ? Math.round((stats.studyTipsRead / total) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-white">Your Journey</h2>
            {stats.isPremium && (
              <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                ✨ Premium
              </span>
            )}
          </div>
          <button onClick={onClose} className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/10 transition-all" aria-label="Close">
            <X className="h-5 w-5 text-white/60" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-3 px-3 font-sans font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === "stats" ? "text-primary border-primary" : "text-white/60 border-transparent hover:text-white/80"}`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => stats.isPremium ? setActiveTab("advanced") : undefined}
            className={`pb-3 px-3 font-sans font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === "advanced" ? "text-primary border-primary" : "text-white/60 border-transparent hover:text-white/80"
            } ${!stats.isPremium ? "opacity-40 cursor-not-allowed" : ""}`}
            title={!stats.isPremium ? "Premium feature" : undefined}
          >
            {!stats.isPremium ? "🔒" : "📈"} Advanced
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`pb-3 px-3 font-sans font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === "achievements" ? "text-primary border-primary" : "text-white/60 border-transparent hover:text-white/80"}`}
          >
            🏆 Badges ({unlockedCount}/{achievements.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── BASIC STATS ── */}
          {activeTab === "stats" && (
            <div className="space-y-6">

              {/* Level + XP card */}
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👑</span>
                    <div>
                      <p className="font-bold text-white text-lg leading-tight">Level {level}</p>
                      <p className="text-xs text-white/50">{stats.xp.toLocaleString()} total XP earned</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">{xpInLevel}<span className="text-xs font-normal text-white/40">/{xpToNextLevel}</span></p>
                    <p className="text-[10px] text-white/40">to Level {level + 1}</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 animate-xp-fill"
                    style={{ width: `${xpInLevel}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Quotes Read", value: stats.quotesRead, from: "from-amber-500/20", to: "to-orange-500/20", iconColor: "text-amber-400", Icon: BookOpen },
                  { label: "Bible Insights", value: stats.bibleInsightsRead, from: "from-purple-500/20", to: "to-indigo-500/20", iconColor: "text-purple-400", Icon: BookOpen },
                  { label: "Study Tips", value: stats.studyTipsRead, from: "from-orange-500/20", to: "to-red-500/20", iconColor: "text-orange-400", Icon: Lightbulb },
                  { label: "Total Saved", value: stats.favoriteCount, from: "from-pink-500/20", to: "to-rose-500/20", iconColor: "text-pink-400", Icon: Heart },
                  { label: "Day Streak", value: stats.streak, from: "from-red-500/20", to: "to-orange-500/20", iconColor: "text-orange-400", Icon: Flame },
                  { label: "Times Shared", value: stats.shareCount, from: "from-blue-500/20", to: "to-cyan-500/20", iconColor: "text-blue-400", Icon: Star },
                ].map(({ label, value, from, to, iconColor, Icon }) => (
                  <div key={label} className="rounded-2xl border border-white/20 bg-white/5 p-4 text-center">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br ${from} ${to} mx-auto mb-2`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-white/60 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-sans text-sm font-semibold text-white/80">Progress to Milestone</h3>
                <div className="rounded-full bg-white/10 h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-pink-500 transition-all duration-500" style={{ width: `${Math.min((total / totalMax) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-white/60">{total} / {totalMax} total items</p>
              </div>
            </div>
          )}

          {/* ── ADVANCED STATS (PREMIUM) ── */}
          {activeTab === "advanced" && stats.isPremium && (
            <div className="space-y-6">
              {/* Most used content type */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs text-white/60 mb-1 font-sans">🏅 Your Favourite Content Type</p>
                <p className="text-xl font-bold text-white">{mostUsedLabel}</p>
              </div>

              {/* Content breakdown bar chart */}
              <div className="space-y-3">
                <h3 className="font-sans text-sm font-semibold text-white/80">📊 Content Breakdown</h3>
                {[
                  { label: "💬 Quotes", pct: quotePct, color: "bg-amber-400" },
                  { label: "📖 Bible Insights", pct: biblePct, color: "bg-purple-400" },
                  { label: "🧠 Study Tips", pct: studyPct, color: "bg-orange-400" },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="rounded-full bg-white/10 h-2 overflow-hidden">
                      <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Engagement score */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                <h3 className="font-sans text-sm font-semibold text-white/80">⚡ Engagement Score</h3>
                <p className="text-3xl font-bold text-white">
                  {Math.min(Math.floor((total * 10 + stats.favoriteCount * 20 + stats.streak * 15 + stats.shareCount * 25) / 10), 1000)}
                  <span className="text-sm font-normal text-white/50 ml-1">/ 1000</span>
                </p>
                <div className="rounded-full bg-white/10 h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                    style={{ width: `${Math.min((total * 10 + stats.favoriteCount * 20 + stats.streak * 15 + stats.shareCount * 25) / 10, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-white/50">Based on: reads, saved items, streak & shares</p>
              </div>

              {/* Reflection stats */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-sans text-sm font-semibold text-white/80 mb-3">✍️ Reflection Activity</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stats.reflectionCount}</p>
                    <p className="text-xs text-white/60">Written</p>
                  </div>
                  <div className="flex-1 rounded-full bg-white/10 h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-pink-400"
                      style={{ width: `${Math.min((stats.reflectionCount / 25) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40">{stats.reflectionCount}/25</p>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-3">
                <h3 className="font-sans text-sm font-semibold text-white/80">🎯 Next Goals</h3>
                {[
                  { label: "Read 50 items total", current: total, target: 50, color: "bg-amber-400" },
                  { label: "Save 10 favourites", current: stats.favoriteCount, target: 10, color: "bg-pink-400" },
                  { label: "Reach 7-day streak", current: stats.streak, target: 7, color: "bg-orange-400" },
                  { label: "Share 5 times", current: stats.shareCount, target: 5, color: "bg-blue-400" },
                ].map(({ label, current, target, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between text-xs text-white/70">
                        <span>{label}</span>
                        <span className={current >= target ? "text-green-400" : ""}>{Math.min(current, target)}/{target}</span>
                      </div>
                      <div className="rounded-full bg-white/10 h-1.5 overflow-hidden">
                        <div className={`h-full ${current >= target ? "bg-green-400" : color} transition-all duration-700`} style={{ width: `${Math.min((current / target) * 100, 100)}%` }} />
                      </div>
                    </div>
                    {current >= target && <span className="text-green-400 text-sm">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ACHIEVEMENTS ── */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-2xl border p-3 transition-all ${achievement.unlocked ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5 opacity-50"}`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-sans font-semibold text-xs text-white leading-tight mb-1">{achievement.name}</p>
                  <p className="font-sans text-xs text-white/60">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-green-400 mt-2 font-sans">✓ {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
