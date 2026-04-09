"use client"

export function AdBanner() {
  return (
    <div
      className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1.5 text-center"
      role="complementary"
      aria-label="Advertisement"
    >
      <p className="text-[8px] uppercase tracking-widest text-white/25 font-sans mb-1">
        Advertisement
      </p>
      <div className="h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-white/5 to-white/8 border border-white/8">
        <p className="text-xs text-white/30 font-sans italic">Your ad here · 320 × 50</p>
      </div>
    </div>
  )
}
