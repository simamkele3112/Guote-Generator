// Category color mapping - consistent across all components
export const categoryColors: Record<string, string> = {
  all: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
  success: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  motivation: "from-rose-500/20 to-pink-500/10 border-rose-500/30",
  discipline: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30",
  love: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  faith: "from-indigo-500/20 to-violet-500/10 border-indigo-500/30",
  life: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  money: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  student: "from-orange-500/20 to-red-500/10 border-orange-500/30",
  hustle: "from-red-500/20 to-rose-500/10 border-red-500/30",
  work: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  investing: "from-green-500/20 to-emerald-500/10 border-green-500/30",
  kingdom: "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
  "bible-stories": "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30",
  "study-strategies": "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
}

export const categoryBadgeColors: Record<string, string> = {
  all: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  success: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  motivation: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  discipline: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  love: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  faith: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  life: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  money: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  student: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  hustle: "bg-red-500/20 text-red-300 border-red-500/30",
  work: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  investing: "bg-green-500/20 text-green-300 border-green-500/30",
  kingdom: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "bible-stories": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  "study-strategies": "bg-teal-500/20 text-teal-300 border-teal-500/30",
}

// Canvas gradient colors for downloaded images (RGB hex values)
export const categoryCanvasGradients: Record<string, [string, string, string]> = {
  all: ["#0891b2", "#0284c7", "#0369a1"],
  success: ["#b45309", "#d97706", "#ea580c"],
  motivation: ["#be185d", "#ec4899", "#f43f5e"],
  discipline: ["#ca8a04", "#eab308", "#facc15"],
  love: ["#ec4899", "#f472b6", "#fb7185"],
  faith: ["#6366f1", "#7c3aed", "#a855f7"],
  life: ["#059669", "#10b981", "#34d399"],
  money: ["#7c3aed", "#a855f7", "#c084fc"],
  student: ["#ea580c", "#f97316", "#fb923c"],
  hustle: ["#dc2626", "#ef4444", "#f87171"],
  work: ["#2563eb", "#3b82f6", "#60a5fa"],
  investing: ["#16a34a", "#22c55e", "#4ade80"],
  kingdom: ["#9333ea", "#a855f7", "#c084fc"],
  "bible-stories": ["#d946ef", "#ec4899", "#f472b6"],
  "study-strategies": ["#0d9488", "#14b8a6", "#2dd4bf"],
}

// ── Card colour themes (user-selectable) ──────────────────────────────────────
export interface CardTheme {
  id: string
  name: string
  /** Tailwind card gradient + border class string */
  cardClass: string
  /** Swatch colour shown in the picker (CSS colour string) */
  swatch: string
  /** Canvas: 4 gradient stops — [top-left, top-right, bottom-left, bottom-right] */
  canvas: [string, string, string, string]
  /** Accent colour for author divider line on canvas */
  accent: string
}

export const CARD_THEMES: CardTheme[] = [
  {
    id: "violet",
    name: "Violet Dream",
    cardClass: "from-violet-500/25 to-purple-900/40 border-violet-400/40",
    swatch: "#7c3aed",
    canvas: ["#1e1b4b", "#4c1d95", "#7c3aed", "#db2777"],
    accent: "#c084fc",
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    cardClass: "from-blue-600/25 to-slate-900/50 border-blue-400/40",
    swatch: "#1d4ed8",
    canvas: ["#0f172a", "#1e3a5f", "#1d4ed8", "#0891b2"],
    accent: "#38bdf8",
  },
  {
    id: "sunset",
    name: "Sunset",
    cardClass: "from-orange-500/25 to-rose-900/40 border-orange-400/40",
    swatch: "#ea580c",
    canvas: ["#431407", "#9a3412", "#ea580c", "#f97316"],
    accent: "#fbbf24",
  },
  {
    id: "forest",
    name: "Forest",
    cardClass: "from-emerald-500/25 to-teal-900/40 border-emerald-400/40",
    swatch: "#059669",
    canvas: ["#022c22", "#065f46", "#059669", "#0d9488"],
    accent: "#34d399",
  },
  {
    id: "rose",
    name: "Rose Gold",
    cardClass: "from-pink-500/25 to-rose-900/40 border-pink-400/40",
    swatch: "#e11d48",
    canvas: ["#4c0519", "#9f1239", "#e11d48", "#f472b6"],
    accent: "#fda4af",
  },
  {
    id: "gold",
    name: "Golden Hour",
    cardClass: "from-yellow-400/25 to-amber-900/40 border-yellow-400/40",
    swatch: "#d97706",
    canvas: ["#1c0a00", "#78350f", "#d97706", "#fbbf24"],
    accent: "#fde68a",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    cardClass: "from-gray-600/25 to-zinc-900/50 border-gray-400/30",
    swatch: "#374151",
    canvas: ["#09090b", "#18181b", "#27272a", "#3f3f46"],
    accent: "#a1a1aa",
  },
]
