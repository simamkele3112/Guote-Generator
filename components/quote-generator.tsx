"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { RefreshCw, Lock, Share2, Copy, Zap, Crown } from "lucide-react"
import quotesData from "@/data/quotes.json"
import bibleInsightsData from "@/data/bible-insights.json"
import studyTipsData from "@/data/study-tips.json"
import { useReflections } from "@/hooks/use-reflections"
import { useAchievements } from "@/hooks/use-achievements"
import { QuoteCard } from "./quote-card"
import { CategoryFilter } from "./category-filter"
import { SavedQuotesScreen } from "./saved-quotes-screen"
import { StatsModal } from "./stats-modal"
import { BottomNav } from "./bottom-nav"
import { BottomSheet } from "./bottom-sheet"
import { QuoteRating } from "./quote-rating"
import { SocialShareImage } from "./social-share-image"
import { PremiumFeatures } from "./premium-features"
import { AppAbout } from "./app-about"
import { DonationSection } from "./donation-section"
import { AdBanner } from "./ad-banner"
import { PaymentModal } from "./payment-modal"

const FREE_LIMIT = 20

interface Quote {
  id: number
  text: string
  author: string
  category: string
}

// One fixed default quote per category — always shown when that category is selected.
// Uses the first quote of each category in the data file for determinism.
const DEFAULT_QUOTE_BY_CATEGORY: Record<string, number> = {
  success:    1,    // "Success is not final, failure is not fatal…" – Churchill
  motivation: 23,   // "Believe you can and you're halfway there." – T. Roosevelt
  discipline: 45,   // "Discipline is the bridge between goals and accomplishment." – Jim Rohn
  love:       67,   // "The best thing to hold onto in life is each other." – Hepburn
  faith:      89,   // "Faith is taking the first step even when you don't see the whole staircase." – MLK
  life:       111,  // "Life is what happens when you're busy making other plans." – Lennon
  money:      133,  // "A wise person should have money in their head, but not in their heart." – Swift
  student:    155,  // "Study now so your future self doesn't struggle later."
  hustle:     165,  // "While they sleep, you build."
  work:       175,  // "Your job funds your dreams, but your discipline builds them."
  investing:  185,  // "Money grows where patience lives."
  kingdom:    195,  // "God will not bless what you refuse to build."
}

function getQuoteById(id: number): Quote | null {
  return (quotesData as Quote[]).find((q) => q.id === id) ?? null
}

function getRandomQuote(category: string, seen: Set<number>): Quote | null {
  const pool = (quotesData as Quote[]).filter(
    (q) => (category === "all" || q.category === category) && !seen.has(q.id)
  )
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function QuoteGenerator() {
  const [category, setCategory] = useState("all")
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [quotesUsed, setQuotesUsed] = useState(0)
  const [bibleInsightsUsed, setBibleInsightsUsed] = useState(0)
  const [studyTipsUsed, setStudyTipsUsed] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const [favorites, setFavorites] = useState<Quote[]>([])
  const [showSavedQuotes, setShowSavedQuotes] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastVisitDate, setLastVisitDate] = useState<string>("")
  const [xp, setXp] = useState(0)
  const [sessionQuoteCount, setSessionQuoteCount] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showShareSheet, setShowShareSheet] = useState(false)
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const [showPremiumInfo, setShowPremiumInfo] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showAboutInfo, setShowAboutInfo] = useState(false)
  const [showDonationInfo, setShowDonationInfo] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"quote" | "bible" | "study">("quote")
  const [currentBibleInsightIndex, setCurrentBibleInsightIndex] = useState(0)
  const [currentStudyTipIndex, setCurrentStudyTipIndex] = useState(0)
  const [bibleFavorites, setBibleFavorites] = useState<Set<number>>(new Set())
  const [studyFavorites, setStudyFavorites] = useState<Set<number>>(new Set())
  // ── Gamification extras ──
  const [comboCount, setComboCount] = useState(0)
  const [lastActionTime, setLastActionTime] = useState(0)
  const [isGoldenQuote, setIsGoldenQuote] = useState(false)
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null)
  const [dailyReads, setDailyReads] = useState(0)
  const [dailyShares, setDailyShares] = useState(0)
  const [dailySaves, setDailySaves] = useState(0)
  const [adsSeenCount, setAdsSeenCount] = useState(0)
  const prevUnlockedCountRef = useRef(0)
  const [levelUpNum, setLevelUpNum] = useState<number | null>(null)
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null)
  const [questTimeLeft, setQuestTimeLeft] = useState("")
  const [toolbarVisible, setToolbarVisible] = useState(true)
  const lastScrollRef = useRef(0)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const deferredPromptRef = useRef<any>(null)

  const { reflections, getReflection, saveReflection } = useReflections()
  const { achievements, unlockAchievement, updateProgress, getUnlockedCount } = useAchievements()

  const isFavorite = quote ? favorites.some((f) => f.id === quote.id) : false
  const level = Math.floor(xp / 100) + 1
  const currentBibleInsight = bibleInsightsData[currentBibleInsightIndex]
  const currentStudyTip = studyTipsData[currentStudyTipIndex]
  const quoteOfDayId = (quotesData as Quote[])[Math.floor(Date.now() / 86400000) % (quotesData as Quote[]).length].id
  const isQuoteOfDay = quote?.id === quoteOfDayId

  // Window-level scroll — makes iOS Safari auto-hide its address bar
  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY
      if (cur < 10) {
        setToolbarVisible(true)
      } else if (cur > lastScrollRef.current + 8) {
        setToolbarVisible(false)
      } else if (cur < lastScrollRef.current - 8) {
        setToolbarVisible(true)
      }
      lastScrollRef.current = cur
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Show install prompt once (iOS + Android)
  useEffect(() => {
    if (typeof window === "undefined") return
    const isStandalone =
      (navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches
    const dismissed = localStorage.getItem("installBannerDismissed")
    if (isStandalone || dismissed) return

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const android = /android/i.test(navigator.userAgent)
    setIsAndroid(android)

    if (isIOS) {
      setShowInstallBanner(true)
      const t = setTimeout(() => {
        setShowInstallBanner(false)
        localStorage.setItem("installBannerDismissed", "1")
      }, 7000)
      return () => clearTimeout(t)
    }

    // Android: listen for Chrome install event
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPromptRef.current = e
      setShowInstallBanner(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const dismissInstallBanner = useCallback(async () => {
    if (isAndroid && deferredPromptRef.current) {
      deferredPromptRef.current.prompt()
      await deferredPromptRef.current.userChoice
      deferredPromptRef.current = null
    }
    setShowInstallBanner(false)
    if (typeof window !== "undefined") localStorage.setItem("installBannerDismissed", "1")
  }, [isAndroid])

  // ── Toast helper ──
  const showToast = useCallback((text: string, color = "text-amber-300") => {
    setToast({ text, color })
    setTimeout(() => setToast(null), 2500)
  }, [])

  // Quest countdown to midnight
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setQuestTimeLeft(`${h}h ${m}m left`)
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

  // Auto-dismiss welcome banner
  useEffect(() => {
    if (!welcomeMessage) return
    const id = setTimeout(() => setWelcomeMessage(null), 4000)
    return () => clearTimeout(id)
  }, [welcomeMessage])

  // Initialize streak from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStreak = localStorage.getItem("quoteAppStreak") || "0"
      const savedDate = localStorage.getItem("quoteAppLastVisit") || ""
      const today = new Date().toDateString()

      const streakNum = parseInt(savedStreak, 10)
      const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]
      if (savedDate === today) {
        setStreak(streakNum)
      } else if (savedDate === new Date(Date.now() - 86400000).toDateString()) {
        // Yesterday - continue streak
        const newStreak = streakNum + 1
        setStreak(newStreak)
        localStorage.setItem("quoteAppStreak", newStreak.toString())
        localStorage.setItem("quoteAppLastVisit", today)
        if (STREAK_MILESTONES.includes(newStreak)) {
          setWelcomeMessage(`🏆 ${newStreak} Day Streak! You're on fire!`)
        } else {
          setWelcomeMessage(`🔥 Day ${newStreak}! Welcome back!`)
        }
      } else {
        // Reset streak
        setStreak(1)
        localStorage.setItem("quoteAppStreak", "1")
        localStorage.setItem("quoteAppLastVisit", today)
        if (savedDate) setWelcomeMessage("✨ Good to see you! Let's find your inspiration.")
      }
      setLastVisitDate(today)
    }
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quoteAppFavorites")
      if (saved) {
        try {
          setFavorites(JSON.parse(saved))
        } catch (e) {
          // ignore malformed data
          void e
        }
      }
    }
  }, [])

  const toggleFavorite = useCallback(() => {
    if (!quote) return
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === quote.id)
      const updated = exists ? prev.filter((f) => f.id !== quote.id) : [...prev, quote]
      if (typeof window !== "undefined") {
        localStorage.setItem("quoteAppFavorites", JSON.stringify(updated))
      }
      if (!exists) {
        setDailySaves((c) => c + 1)
        setXp((prevXp) => prevXp + 5)
      }
      return updated
    })
  }, [quote])

  const removeFavorite = useCallback((id: number, type?: "quote" | "bible" | "study") => {
    if (type === "bible") {
      setBibleFavorites((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } else if (type === "study") {
      setStudyFavorites((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } else {
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    }
  }, [])

  // Load Bible and Study favorites from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBible = localStorage.getItem("bibleFavorites")
      const savedStudy = localStorage.getItem("studyFavorites")
      
      if (savedBible) {
        try {
          setBibleFavorites(new Set(JSON.parse(savedBible)))
        } catch (e) {
          void e
        }
      }
      
      if (savedStudy) {
        try {
          setStudyFavorites(new Set(JSON.parse(savedStudy)))
        } catch (e) {
          void e
        }
      }
    }
  }, [])

  // Save Bible favorites to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && bibleFavorites.size > 0) {
      localStorage.setItem("bibleFavorites", JSON.stringify(Array.from(bibleFavorites)))
    }
  }, [bibleFavorites])

  // Save Study favorites to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && studyFavorites.size > 0) {
      localStorage.setItem("studyFavorites", JSON.stringify(Array.from(studyFavorites)))
    }
  }, [studyFavorites])

  // Load all persisted data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedXp = localStorage.getItem("quoteAppXp") || "0"
      const savedShares = localStorage.getItem("quoteAppShares") || "0"
      const savedQuotes = localStorage.getItem("quoteAppQuotesUsed") || "0"
      const savedBible = localStorage.getItem("quoteAppBibleInsights") || "0"
      const savedStudy = localStorage.getItem("quoteAppStudyTips") || "0"
      const savedPremium = localStorage.getItem("userPremium")
      setXp(parseInt(savedXp, 10))
      setShareCount(parseInt(savedShares, 10))
      setQuotesUsed(parseInt(savedQuotes, 10))
      setBibleInsightsUsed(parseInt(savedBible, 10))
      setStudyTipsUsed(parseInt(savedStudy, 10))
      if (savedPremium) setIsPremium(JSON.parse(savedPremium))

      // Check for first quote achievement
      unlockAchievement("first_quote")
    }
  }, [unlockAchievement])

  // Persist premium state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userPremium", JSON.stringify(isPremium))
    }
  }, [isPremium])

  // Auto-save XP and share count
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quoteAppXp", xp.toString())
    }
  }, [xp])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quoteAppShares", shareCount.toString())
    }
  }, [shareCount])

  // Auto-save stats
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quoteAppQuotesUsed", quotesUsed.toString())
    }
  }, [quotesUsed])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quoteAppBibleInsights", bibleInsightsUsed.toString())
    }
  }, [bibleInsightsUsed])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quoteAppStudyTips", studyTipsUsed.toString())
    }
  }, [studyTipsUsed])

  // Load daily quest progress
  useEffect(() => {
    if (typeof window !== "undefined") {
      const todayKey = new Date().toDateString()
      const saved = localStorage.getItem("dailyQuestData")
      const adsKey = localStorage.getItem("quoteAppAdsSeenDate")
      const adsCount = localStorage.getItem("quoteAppAdsSeen") || "0"
      if (adsKey === todayKey) {
        setAdsSeenCount(parseInt(adsCount, 10))
      }
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.date === todayKey) {
            setDailyReads(data.reads || 0)
            setDailyShares(data.shares || 0)
            setDailySaves(data.saves || 0)
          }
        } catch (e) { void e }
      }
    }
  }, [])

  // Save daily quest progress
  useEffect(() => {
    if (typeof window !== "undefined") {
      const todayKey = new Date().toDateString()
      localStorage.setItem("dailyQuestData", JSON.stringify({ date: todayKey, reads: dailyReads, shares: dailyShares, saves: dailySaves }))
      if (dailyReads >= 5 && dailyShares >= 1 && dailySaves >= 1) {
        const completedKey = `dailyQuestCompleted_${todayKey}`
        if (!localStorage.getItem(completedKey)) {
          localStorage.setItem(completedKey, "1")
          showToast("🎯 Daily Quest Complete! +200 XP", "text-green-300")
          setXp((prev) => prev + 200)
        }
      }
    }
  }, [dailyReads, dailyShares, dailySaves, showToast])

  // Achievement unlock detection
  useEffect(() => {
    const currentCount = achievements.filter((a) => a.unlocked).length
    if (currentCount > prevUnlockedCountRef.current && prevUnlockedCountRef.current > 0) {
      const newest = achievements
        .filter((a) => a.unlocked && a.unlockedAt)
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0]
      if (newest) showToast(`${newest.icon} Badge Unlocked: ${newest.name}!`, "text-purple-300")
    }
    prevUnlockedCountRef.current = currentCount
  }, [achievements, showToast])

  // Check achievements periodically
  useEffect(() => {
    if (favorites.length >= 5) updateProgress("collector_5", favorites.length, 5)
    if (favorites.length >= 25) updateProgress("collector_25", favorites.length, 25)
    
    const reflectionCount = Object.keys(reflections).length
    if (reflectionCount >= 5) updateProgress("reflects_5", reflectionCount, 5)
    if (reflectionCount >= 25) updateProgress("reflects_25", reflectionCount, 25)

    if (streak >= 7) updateProgress("streak_7", streak, 7)
    if (streak >= 30) updateProgress("streak_30", streak, 30)

    if (quotesUsed >= 50) updateProgress("reads_50", quotesUsed, 50)
    if (quotesUsed >= 200) updateProgress("reads_200", quotesUsed, 200)
    
    const totalContent = quotesUsed + bibleInsightsUsed + studyTipsUsed
    if (totalContent >= 50) updateProgress("total_reads_50", totalContent, 50)
    if (totalContent >= 200) updateProgress("total_reads_200", totalContent, 200)

    if (shareCount >= 5) updateProgress("shares_5", shareCount, 5)

    // Check for power hour (10 quotes in one session)
    if (sessionQuoteCount >= 10) unlockAchievement("power_hour")
  }, [favorites.length, Object.keys(reflections).length, streak, quotesUsed, bibleInsightsUsed, studyTipsUsed, shareCount, sessionQuoteCount, updateProgress, unlockAchievement])
  // Initial quote does not count toward free limit
  useEffect(() => {
    if (quote === null) {
      const newSeen = new Set<number>()
      const randomQuote = getRandomQuote("all", newSeen)
      if (randomQuote) {
        newSeen.add(randomQuote.id)
        setSeen(newSeen)
        setQuote(randomQuote)
        // Do NOT increment quotesUsed for the initial quote
      }
    }
  }, [quote])

  const totalContentViewed = quotesUsed + bibleInsightsUsed + studyTipsUsed
  const isLimitReached = !isPremium && totalContentViewed >= FREE_LIMIT

  const handleNewQuote = useCallback(() => {
    if (isLimitReached || !quote) return
    const now = Date.now()
    const diff = now - lastActionTime
    const newCombo = diff < 8000 ? Math.min(comboCount + 1, 6) : 1
    setComboCount(newCombo)
    setLastActionTime(now)

    const multiplier = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1
    const isGolden = Math.random() < 0.085
    setIsGoldenQuote(isGolden)
    const baseXp = 10 * multiplier
    const goldenBonus = isGolden ? (isPremium ? 60 : 40) : 0
    const totalXp = baseXp + goldenBonus

    setIsAnimating(true)
    setTimeout(() => {
      let newSeen = new Set(seen)
      newSeen.add(quote.id)
      let next = getRandomQuote(category, newSeen)
      if (!next) {
        newSeen = new Set()
        next = getRandomQuote(category, newSeen)!
      }
      newSeen.add(next.id)
      setSeen(newSeen)
      setQuote(next)
      setQuotesUsed((c) => c + 1)
      setSessionQuoteCount((c) => c + 1)
      setDailyReads((c) => c + 1)

      setXp((prevXp) => {
        const newXp = prevXp + totalXp
        const oldLevel = Math.floor(prevXp / 100) + 1
        const newLevel = Math.floor(newXp / 100) + 1
        if (newLevel > oldLevel) {
          setTimeout(() => { setLevelUpNum(newLevel); setTimeout(() => setLevelUpNum(null), 2200) }, 60)
        }
        return newXp
      })

      if (isGolden) {
        showToast(`✨ Rare Quote! +${goldenBonus} bonus XP`, "text-amber-300")
      } else if (newCombo === 5) {
        showToast("⚡ On Fire! Triple XP!", "text-yellow-300")
      } else if (newCombo === 3) {
        showToast("🔥 Combo ×2! Double XP!", "text-orange-300")
      }

      setIsAnimating(false)
    }, 300)
  }, [isLimitReached, seen, quote, category, lastActionTime, comboCount, isPremium, showToast])

  const handleNextBibleInsight = useCallback(() => {
    const now = Date.now()
    const diff = now - lastActionTime
    const newCombo = diff < 8000 ? Math.min(comboCount + 1, 6) : 1
    setComboCount(newCombo)
    setLastActionTime(now)
    const multiplier = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentBibleInsightIndex(Math.floor(Math.random() * bibleInsightsData.length))
      setBibleInsightsUsed((c) => c + 1)
      setDailyReads((c) => c + 1)
      setXp((prevXp) => {
        const gain = 10 * multiplier
        const newXp = prevXp + gain
        const oldLevel = Math.floor(prevXp / 100) + 1
        const newLevel = Math.floor(newXp / 100) + 1
        if (newLevel > oldLevel) {
          setTimeout(() => { setLevelUpNum(newLevel); setTimeout(() => setLevelUpNum(null), 2200) }, 60)
        }
        return newXp
      })
      if (newCombo === 3) showToast("🔥 Combo ×2!", "text-orange-300")
      if (newCombo === 5) showToast("⚡ On Fire! Triple XP!", "text-yellow-300")
      setIsAnimating(false)
    }, 300)
  }, [lastActionTime, comboCount, showToast])

  const handleNextStudyTip = useCallback(() => {
    const now = Date.now()
    const diff = now - lastActionTime
    const newCombo = diff < 8000 ? Math.min(comboCount + 1, 6) : 1
    setComboCount(newCombo)
    setLastActionTime(now)
    const multiplier = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStudyTipIndex(Math.floor(Math.random() * studyTipsData.length))
      setStudyTipsUsed((c) => c + 1)
      setDailyReads((c) => c + 1)
      setXp((prevXp) => {
        const gain = 10 * multiplier
        const newXp = prevXp + gain
        const oldLevel = Math.floor(prevXp / 100) + 1
        const newLevel = Math.floor(newXp / 100) + 1
        if (newLevel > oldLevel) {
          setTimeout(() => { setLevelUpNum(newLevel); setTimeout(() => setLevelUpNum(null), 2200) }, 60)
        }
        return newXp
      })
      if (newCombo === 3) showToast("🔥 Combo ×2!", "text-orange-300")
      if (newCombo === 5) showToast("⚡ Triple XP! You're on fire!", "text-yellow-300")
      setIsAnimating(false)
    }, 300)
  }, [lastActionTime, comboCount, showToast])

  const handleToggleBibleFavorite = useCallback(() => {
    setBibleFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(bibleInsightsData[currentBibleInsightIndex].id)) {
        next.delete(bibleInsightsData[currentBibleInsightIndex].id)
      } else {
        next.add(bibleInsightsData[currentBibleInsightIndex].id)
      }
      return next
    })
  }, [currentBibleInsightIndex])

  const handleToggleStudyFavorite = useCallback(() => {
    setStudyFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(studyTipsData[currentStudyTipIndex].id)) {
        next.delete(studyTipsData[currentStudyTipIndex].id)
      } else {
        next.add(studyTipsData[currentStudyTipIndex].id)
      }
      return next
    })
  }, [currentStudyTipIndex])

  // Category selection always shows the one fixed default quote for that category.
  // Never random, never counts toward the limit, always the same quote.
  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat)
    setIsAnimating(true)
    setTimeout(() => {
      let next: Quote | null = null
      if (cat === "all") {
        // For "all", show the globally fixed first quote in the dataset
        next = getQuoteById(1)
      } else {
        const defaultId = DEFAULT_QUOTE_BY_CATEGORY[cat]
        next = defaultId ? getQuoteById(defaultId) : null
      }
      if (next) {
        setQuote(next)
        // Reset seen to just this default so Generate picks something fresh
        setSeen(new Set([next.id]))
      }
      setIsAnimating(false)
    }, 200)
  }, [])

  const handleCopyQuote = useCallback(() => {
    setXp((prevXp) => prevXp + 5)
  }, [])

  const handleDownloadQuote = useCallback(async () => {
    if (!quote) return
    
    const canvas = document.createElement("canvas")
    canvas.width = 1080
    canvas.height = 1080

    const ctx = canvas.getContext("2d")!

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080)
    gradient.addColorStop(0, "#1e1b4b")
    gradient.addColorStop(0.4, "#4c1d95")
    gradient.addColorStop(0.7, "#7c3aed")
    gradient.addColorStop(1, "#db2777")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1080)

    // Subtle overlay circle
    const radGrad = ctx.createRadialGradient(950, 130, 10, 950, 130, 340)
    radGrad.addColorStop(0, "rgba(236,72,153,0.3)")
    radGrad.addColorStop(1, "rgba(236,72,153,0)")
    ctx.fillStyle = radGrad
    ctx.fillRect(0, 0, 1080, 1080)

    // Card background
    ctx.fillStyle = "rgba(255,255,255,0.08)"
    const cardX = 80
    const cardY = 180
    const cardW = 920
    const cardH = 720
    ctx.fillRect(cardX, cardY, cardW, cardH)

    // Quote text
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.font = "600 52px Georgia, serif"
    ctx.textAlign = "center"
    
    const words = quote.text.split(" ")
    let line = ""
    const lines = []
    const maxWidth = cardW - 80

    for (const word of words) {
      const testLine = line + word + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line) {
        lines.push(line)
        line = word + " "
      } else {
        line = testLine
      }
    }
    lines.push(line)

    const lineHeight = 70
    const totalHeight = lines.length * lineHeight
    let startY = cardY + (cardH - totalHeight - 80) / 2

    lines.forEach((l, idx) => {
      ctx.fillText(`"${l.trim()}"`, 540, startY + idx * lineHeight)
    })

    // Author
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.font = "500 34px Georgia, serif"
    ctx.fillText("— " + quote.author, 540, cardY + cardH - 60)

    // Category badge
    ctx.fillStyle = "rgba(255,255,255,0.15)"
    ctx.fillRect(440, cardY + 30, 200, 50)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.font = "500 26px sans-serif"
    ctx.fillText(quote.category.toUpperCase(), 540, cardY + 64)

    // Create download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `quoteapp-${quote.id}.png`
        link.click()
        URL.revokeObjectURL(url)
      }
    })

    setXp((prevXp) => prevXp + 10)
  }, [quote])

  const handleShare = useCallback(() => {
    setShareCount((c) => c + 1)
    setDailyShares((c) => c + 1)
    setXp((prevXp) => prevXp + 15)
    // Track ads seen (shared = engagement, not an ad impression, but useful counter)
    setShowShareSheet(false)
  }, [])

  const handleResetProgress = useCallback(() => {
    setQuotesUsed(0)
    setBibleInsightsUsed(0)
    setStudyTipsUsed(0)
    setSessionQuoteCount(0)
    setXp(0)
    if (typeof window !== "undefined") {
      localStorage.removeItem("quoteAppQuotesUsed")
      localStorage.removeItem("quoteAppBibleInsights")
      localStorage.removeItem("quoteAppStudyTips")
      localStorage.removeItem("quoteAppXp")
    }
    setShowMoreSheet(false)
  }, [])

  const handleTogglePremium = useCallback(() => {
    setIsPremium((prev) => !prev)
    setShowMoreSheet(false)
  }, [])

  return (
    <main
      className="relative w-full min-h-[100dvh] flex flex-col"
      style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #3b1275 30%, #6d1bb5 65%, #c2185b 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-40 left-0 h-56 w-56 rounded-full bg-violet-700/20 blur-3xl" />

      {/* Main content area - scrolls at document level, Safari auto-hides toolbar */}
      <div className="relative z-10 flex flex-col items-center px-3 pb-24 pt-1 safe-area-inset-top">
        {/* Install prompt — the ONLY way to remove Safari address bar on iPhone */}
        {showInstallBanner && (
          <div className="w-full max-w-md mb-1 px-1">
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-indigo-500/25 border border-indigo-400/40 text-white font-sans">
              <span className="text-base flex-shrink-0 mt-0.5">📱</span>
              <div className="flex-1 min-w-0">
                {isAndroid ? (
                  <button onClick={dismissInstallBanner} className="text-xs font-semibold text-left w-full">
                    ↡ Tap to install — runs full screen, no browser bar!
                  </button>
                ) : (
                  <p className="text-[11px] leading-tight">
                    <span className="font-bold">Remove address bar:</span> tap 📤 Share › "Add to Home Screen" › Add. Opens full screen, no Safari bar.
                  </p>
                )}
              </div>
              <button onClick={dismissInstallBanner} className="flex-shrink-0 text-white/40 hover:text-white leading-none text-sm">✕</button>
            </div>
          </div>
        )}
        {/* Welcome back banner */}
        {welcomeMessage && (
          <div className="w-full max-w-md mb-1 px-1">
            <div className="animate-welcome-slide flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/8 border border-white/12 text-xs font-semibold text-white font-sans">
              {welcomeMessage}
            </div>
          </div>
        )}
        {/* Top bar - streak, XP bar, daily quest, quota — auto-hides on scroll down */}
        <div className={`w-full max-w-md transition-all duration-300 overflow-hidden ${toolbarVisible ? 'max-h-10 opacity-100 mb-1' : 'max-h-0 opacity-0 mb-0'}`}>
        <div className="flex items-center justify-between px-1 gap-2">
          {/* Streak badge */}
          <div className="flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2 py-0.5 flex-shrink-0">
            <span className="text-sm">🔥</span>
            <span className="text-[10px] font-semibold text-white font-sans">{streak}</span>
          </div>

          {/* XP level bar - center */}
          <div className="flex-1 flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-white/60 font-sans whitespace-nowrap">Lv.{level}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out animate-xp-fill"
                style={{ width: `${xp % 100}%` }}
              />
            </div>
            <span className="text-[10px] text-white/35 font-sans whitespace-nowrap">{xp % 100}/100</span>
          </div>

          {/* Daily quest dots (3 tasks: 5 reads, 1 share, 1 save) */}
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-white/35 font-sans">Quest</span>
              {[dailyReads >= 5, dailyShares >= 1, dailySaves >= 1].map((done, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${done ? "bg-green-400 shadow-[0_0_4px_1px_rgba(74,222,128,0.6)]" : "bg-white/20"}`}
                />
              ))}
            </div>
            {!(dailyReads >= 5 && dailyShares >= 1 && dailySaves >= 1) && questTimeLeft && (
              <span className="text-[7px] text-white/20 font-sans">{questTimeLeft}</span>
            )}
          </div>

          {/* Quota indicator */}
          {!isPremium && (
            <div className={`text-xs font-medium bg-white/5 px-2 py-1 rounded-lg flex-shrink-0 ${
              totalContentViewed >= FREE_LIMIT * 0.8 ? "text-red-400" : "text-white/60"
            }`}>
              {totalContentViewed}/{FREE_LIMIT}
            </div>
          )}
        </div>
        </div>

        {/* Category selector - centered and aligned with quote card */}
        <div className="w-full max-w-md mb-1 px-1">
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>

        {/* Ad Banner - Free users only */}
        {!isPremium && (
          <div className="w-full max-w-md mb-1 px-1">
            <AdBanner />
          </div>
        )}

        {/* Main quote card - centered and prominent */}
        {quote ? (
          <div className="w-full max-w-md">
            <QuoteCard
              quote={quote}
              isAnimating={isAnimating}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              reflection={getReflection(quote.id)}
              onReflectionChange={(text) => saveReflection(quote.id, text)}
              onCopyQuote={handleCopyQuote}
              onDownloadQuote={handleDownloadQuote}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currentBibleInsight={bibleInsightsData[currentBibleInsightIndex]}
              bibleFavorite={bibleFavorites.has(bibleInsightsData[currentBibleInsightIndex]?.id || 0)}
              onToggleBibleFavorite={handleToggleBibleFavorite}
              bibleReflection={getReflection(10000 + (bibleInsightsData[currentBibleInsightIndex]?.id || 0))}
              onBibleReflectionChange={(text) => saveReflection(10000 + (bibleInsightsData[currentBibleInsightIndex]?.id || 0), text)}
              currentStudyTip={studyTipsData[currentStudyTipIndex]}
              studyFavorite={studyFavorites.has(studyTipsData[currentStudyTipIndex]?.id || 0)}
              onToggleStudyFavorite={handleToggleStudyFavorite}
              studyReflection={getReflection(20000 + (studyTipsData[currentStudyTipIndex]?.id || 0))}
              onStudyReflectionChange={(text) => saveReflection(20000 + (studyTipsData[currentStudyTipIndex]?.id || 0), text)}
              isGolden={isGoldenQuote && viewMode === "quote"}
              isQuoteOfDay={isQuoteOfDay && viewMode === "quote"}
            />
          </div>
        ) : (
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-8 min-h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-white/40 font-sans">Loading inspiration...</div>
          </div>
        )}
      </div>

      {/* Action bar - FIXED above bottom nav */}
      <div className="fixed bottom-[calc(3.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 flex justify-center z-20 px-4">
        <button
          onClick={() => {
            if (viewMode === "bible") {
              handleNextBibleInsight()
            } else if (viewMode === "study") {
              handleNextStudyTip()
            } else {
              handleNewQuote()
            }
          }}
          disabled={isLimitReached}
          className={`w-full mx-4 max-w-md rounded-2xl py-2.5 font-bold transition-all duration-200 font-sans flex items-center justify-center gap-2 ${
            isLimitReached
              ? "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/40 active:scale-95"
          }`}
        >
          {isLimitReached ? (
            <>
              <Crown className="h-5 w-5" />
              Upgrade for More
            </>
          ) : (
            <>
              <RefreshCw className={`h-5 w-5 ${isAnimating ? "animate-spin" : ""}`} />
              {viewMode === "bible" ? "Next Bible Insight" : viewMode === "study" ? "Next Study Tip" : "Next Quote"}
            </>
          )}
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        favoritesCount={favorites.length + bibleFavorites.size + studyFavorites.size}
        onFavorites={() => setShowSavedQuotes(true)}
        onDonate={() => setShowDonationInfo(true)}
        onStats={() => setShowStatsModal(true)}
        onMore={() => setShowMoreSheet(true)}
      />

      {/* Saved Quotes Sheet */}
      {showSavedQuotes && (
        <SavedQuotesScreen
          favorites={favorites}
          bibleFavorites={Array.from(bibleFavorites).map(
            (id) => bibleInsightsData.find((b: any) => b.id === id)
          ).filter((b): b is NonNullable<typeof b> => b !== undefined)}
          studyFavorites={Array.from(studyFavorites).map(
            (id) => studyTipsData.find((s: any) => s.id === id)
          ).filter((s): s is NonNullable<typeof s> => s !== undefined)}
          onClose={() => setShowSavedQuotes(false)}
          onRemove={removeFavorite}
          reflections={reflections}
          onReflectionChange={saveReflection}
        />
      )}

      {/* Share Sheet */}
      <BottomSheet isOpen={showShareSheet} onClose={() => setShowShareSheet(false)} title="Share Quote">
        {quote && (
          <SocialShareImage
            content={{
              type: 'quote',
              id: quote.id,
              text: quote.text,
              author: quote.author,
              category: quote.category,
            }}
          />
        )}
        {viewMode === "bible" && currentBibleInsight && (
          <SocialShareImage
            content={{
              type: 'bible',
              id: currentBibleInsight.id,
              title: currentBibleInsight.title,
              text: currentBibleInsight.lesson,
              reference: currentBibleInsight.reference,
              category: currentBibleInsight.category,
              lesson: currentBibleInsight.lesson,
            }}
          />
        )}
        {viewMode === "study" && currentStudyTip && (
          <SocialShareImage
            content={{
              type: 'study',
              id: currentStudyTip.id,
              title: currentStudyTip.title,
              text: currentStudyTip.tip,
              category: currentStudyTip.category,
              tip: currentStudyTip.tip,
            }}
          />
        )}
      </BottomSheet>

      {/* More Options Sheet */}
      <BottomSheet isOpen={showMoreSheet} onClose={() => setShowMoreSheet(false)} title="More Options">
        <div className="space-y-3">
          {/* Premium upgrade CTA */}
          <button
            onClick={() => {
              setShowMoreSheet(false)
              setShowPremiumInfo(true)
            }}
            className="w-full flex items-center gap-3 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 p-4 transition-all"
          >
            <Crown className="h-5 w-5 text-amber-400" />
            <div className="text-left flex-1">
              <p className="font-semibold text-white text-sm">Go Premium</p>
              <p className="text-xs text-white/60">Unlimited quotes, no ads</p>
            </div>
          </button>

          {/* About */}
          <button
            onClick={() => {
              setShowMoreSheet(false)
              setShowAboutInfo(true)
            }}
            className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all text-white font-medium text-sm"
          >
            ℹ️ About
          </button>

          {/* Donation */}
          <button
            onClick={() => {
              setShowMoreSheet(false)
              setShowDonationInfo(true)
            }}
            className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all text-white font-medium text-sm"
          >
            ❤️ Support Us
          </button>

          {/* Reset Progress (for testing/development) */}
          <button
            onClick={handleResetProgress}
            className="w-full text-left p-3 rounded-lg hover:bg-red-500/10 transition-all text-red-400 font-medium text-sm border border-red-500/20"
          >
            🔄 Reset Progress (Testing)
          </button>

          {/* Premium toggle for testing */}
          <button
            onClick={handleTogglePremium}
            className={`w-full text-left p-3 rounded-lg transition-all font-medium text-sm border ${
              isPremium
                ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                : "border-green-500/20 text-green-400 hover:bg-green-500/10"
            }`}
          >
            {isPremium ? "👑 Disable Premium (Testing)" : "✅ Enable Premium (Testing)"}
          </button>
        </div>
      </BottomSheet>

      {/* Premium Features Sheet */}
      <BottomSheet isOpen={showPremiumInfo} onClose={() => setShowPremiumInfo(false)} title="">
        <PremiumFeatures
          isPremium={isPremium}
          onUpgrade={() => {
            setShowPremiumInfo(false)
            setShowPaymentModal(true)
          }}
          adsSeenCount={adsSeenCount}
          itemsUsed={totalContentViewed}
          freeLimit={FREE_LIMIT}
        />
      </BottomSheet>

      {/* About Sheet */}
      <BottomSheet isOpen={showAboutInfo} onClose={() => setShowAboutInfo(false)} title="">
        <AppAbout />
      </BottomSheet>

      {/* Donation Sheet */}
      <BottomSheet isOpen={showDonationInfo} onClose={() => setShowDonationInfo(false)} title="">
        <DonationSection />
      </BottomSheet>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setIsPremium(true)
            setShowPaymentModal(false)
          }}
        />
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <StatsModal
          onClose={() => setShowStatsModal(false)}
          stats={{
            quotesRead: quotesUsed,
            bibleInsightsRead: bibleInsightsUsed,
            studyTipsRead: studyTipsUsed,
            favoriteCount: favorites.length + bibleFavorites.size + studyFavorites.size,
            reflectionCount: Object.keys(reflections).length,
            streak,
            shareCount,
            xp,
            isPremium,
          }}
          achievements={achievements}
        />
      )}

      {/* ── Combo badge ── */}
      {comboCount >= 3 && (
        <div className="absolute bottom-[calc(7rem+env(safe-area-inset-bottom,0px))] left-0 right-0 flex justify-center z-30 pointer-events-none">
          <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold animate-combo-pop ${
            comboCount >= 5
              ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-300"
              : "bg-orange-500/20 border-orange-400/50 text-orange-300"
          }`}>
            {comboCount >= 5 ? "⚡" : "🔥"}  COMBO ×{comboCount >= 5 ? 3 : 2} &nbsp;&bull;&nbsp; {comboCount >= 5 ? "Triple" : "Double"} XP!
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className="absolute bottom-[calc(9.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/20 bg-black/70 backdrop-blur-md text-sm font-semibold ${toast.color} animate-slide-up-toast shadow-2xl max-w-xs text-center`}>
            {toast.text}
          </div>
        </div>
      )}

      {/* ── Level-up overlay ── */}
      {levelUpNum !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 animate-level-up-pop">
            <div className="text-6xl">🎉</div>
            <div className="text-center space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-white/50 font-sans">Level Up!</p>
              <p className="text-5xl font-black text-white font-sans">Level {levelUpNum}</p>
            </div>
            <p className="text-sm text-amber-300 font-semibold font-sans">Keep growing! 🚀</p>
          </div>
        </div>
      )}
    </main>
  )
}
