"use client"

export function AdBanner() {
  return (
    <div
      className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-center"
      role="complementary"
      aria-label="Advertisement"
    >
      <p className="text-[9px] uppercase tracking-widest text-white/30 font-sans mb-2">
        Advertisement
      </p>
      <div className="h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
        <p className="text-xs text-white/40 font-sans italic">Your ad here · 320 × 50</p>
      </div>
    </div>
  )
}
