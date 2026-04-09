"use client"

export function AdBanner() {
  return (
    <div
      className="w-full rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-2 py-1 flex items-center justify-center"
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="h-7 w-full flex items-center justify-center rounded bg-white/5 border border-white/8">
        <p className="text-[9px] text-white/25 font-sans italic">Ad · 320×50</p>
      </div>
    </div>
  )
}
