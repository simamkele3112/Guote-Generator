"use client"

import { useState } from "react"
import { X, Heart, Trash2, Edit2 } from "lucide-react"

interface Quote {
  id: number
  text: string
  author: string
  category: string
  type?: "quote" | "bible" | "study"
}

interface SavedQuotesScreenProps {
  favorites: Quote[]
  bibleFavorites?: Array<{ id: number; title: string; lesson: string; reference: string; category: string }>
  studyFavorites?: Array<{ id: number; title: string; tip: string; lesson: string; category: string }>
  onClose: () => void
  onRemove: (id: number, type?: "quote" | "bible" | "study") => void
  reflections?: { [quoteId: number]: string }
  onReflectionChange?: (quoteId: number, text: string) => void
}

const categoryBadgeColors: Record<string, string> = {
  success: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  motivation: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  discipline: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  love: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  faith: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  life: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  money: "bg-violet-500/20 text-violet-300 border-violet-500/30",
}

export function SavedQuotesScreen({ 
  favorites, 
  bibleFavorites = [], 
  studyFavorites = [], 
  onClose, 
  onRemove, 
  reflections = {}, 
  onReflectionChange 
}: SavedQuotesScreenProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const totalItems = favorites.length + bibleFavorites.length + studyFavorites.length

  const startEditing = (quoteId: number) => {
    setEditingId(quoteId)
    setEditText(reflections[quoteId] || "")
  }

  const saveEdit = (quoteId: number) => {
    onReflectionChange?.(quoteId, editText)
    setEditingId(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #3b1275 30%, #6d1bb5 65%, #c2185b 100%)",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400 fill-pink-400" aria-hidden="true" />
          <h1 className="font-serif text-xl font-bold text-white">Saved Items</h1>
          <span className="ml-2 text-sm text-white/60 font-sans">({totalItems})</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 border border-white/20 transition-all hover:bg-white/20"
          aria-label="Close saved items"
        >
          <X className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-white/10 border border-white/20">
              <Heart className="h-8 w-8 text-white/40" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium text-white/80 font-sans mb-2">No saved items yet</p>
            <p className="text-sm text-white/50 font-sans max-w-xs">
              Tap the heart icon on any quote, Bible insight, or study tip to save it here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Regular Quotes */}
            {favorites.map((quote) => {
              const badgeClass = categoryBadgeColors[quote.category] ?? "bg-primary/20 text-primary border-primary/30"
              return (
                <div
                  key={`quote-${quote.id}`}
                  className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize font-sans ${badgeClass}`}
                    >
                      Quote
                    </span>
                    <button
                      onClick={() => onRemove(quote.id, "quote")}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 border border-white/10 transition-all hover:bg-red-500/20 hover:border-red-500/30"
                      aria-label={`Remove quote from favorites`}
                    >
                      <Trash2 className="h-4 w-4 text-white/60 hover:text-red-400" aria-hidden="true" />
                    </button>
                  </div>
                  <blockquote className="mb-3">
                    <p className="font-serif text-base leading-relaxed text-white/90 text-pretty">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                  </blockquote>
                  <p className="text-xs font-medium text-white/50 font-sans mb-3">— {quote.author}</p>

                  {/* Reflection Section */}
                  <div className="border-t border-white/10 pt-3">
                    {editingId === quote.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full rounded-lg bg-white/5 border border-white/20 px-2 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 resize-none font-sans"
                          rows={3}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-xs rounded-md border border-white/20 hover:bg-white/10 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(quote.id)}
                            className="px-2 py-1 text-xs rounded-md bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group">
                        {reflections[quote.id] ? (
                          <div>
                            <p className="text-xs font-medium text-white/60 uppercase tracking-wide mb-1">✨ Your Reflection</p>
                            <p className="text-xs text-white/80 leading-relaxed mb-2">{reflections[quote.id]}</p>
                            <button
                              onClick={() => startEditing(quote.id)}
                              className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(quote.id)}
                            className="text-xs text-white/40 hover:text-white/60 transition-colors italic"
                          >
                            + Add your reflection
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Bible Insights */}
            {bibleFavorites.map((insight) => {
              const badgeClass = categoryBadgeColors[insight.category] ?? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
              return (
                <div
                  key={`bible-${insight.id}`}
                  className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize font-sans ${badgeClass}`}
                    >
                      📖 Bible
                    </span>
                    <button
                      onClick={() => onRemove(insight.id, "bible")}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 border border-white/10 transition-all hover:bg-red-500/20 hover:border-red-500/30"
                      aria-label="Remove insight from favorites"
                    >
                      <Trash2 className="h-4 w-4 text-white/60 hover:text-red-400" aria-hidden="true" />
                    </button>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white/90 mb-2">{insight.title}</h3>
                  <blockquote className="mb-3">
                    <p className="font-serif text-sm leading-relaxed text-white/80 text-pretty">
                      {insight.lesson}
                    </p>
                  </blockquote>
                  <p className="text-xs font-medium text-white/50 font-sans">— {insight.reference}</p>
                </div>
              )
            })}

            {/* Study Tips */}
            {studyFavorites.map((tip) => {
              const badgeClass = categoryBadgeColors[tip.category] ?? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              return (
                <div
                  key={`study-${tip.id}`}
                  className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize font-sans ${badgeClass}`}
                    >
                      🧠 Study
                    </span>
                    <button
                      onClick={() => onRemove(tip.id, "study")}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 border border-white/10 transition-all hover:bg-red-500/20 hover:border-red-500/30"
                      aria-label="Remove tip from favorites"
                    >
                      <Trash2 className="h-4 w-4 text-white/60 hover:text-red-400" aria-hidden="true" />
                    </button>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white/90 mb-2">{tip.title}</h3>
                  <blockquote className="mb-3">
                    <p className="font-serif text-sm leading-relaxed text-white/80 text-pretty">
                      {tip.tip}
                    </p>
                  </blockquote>
                  <p className="text-xs font-medium text-white/50 font-sans mb-2">How to apply: {tip.lesson}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
