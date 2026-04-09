"use client"

import { useState } from "react"
import { Copy, Check, Heart } from "lucide-react"

const BANK_FIELDS = [
  { label: "Account Name", value: "Mr S NKQAYINI" },
  { label: "Bank", value: "Capitec" },
  { label: "Account Number", value: "1615865932" },
  { label: "Phone / Send Money", value: "0604567462" },
]

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/8 last:border-0">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-white/40 font-sans font-medium">{label}</p>
        <p className="text-sm font-semibold text-white font-mono mt-0.5 truncate">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
          copied
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            : "bg-white/8 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 active:scale-95"
        }`}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  )
}

export function DonationSection() {
  const [allCopied, setAllCopied] = useState(false)

  const handleCopyAll = () => {
    const text = BANK_FIELDS.map((f) => `${f.label}: ${f.value}`).join("\n")
    navigator.clipboard.writeText(text)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2500)
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="text-center space-y-1 pb-1">
        <p className="text-xs text-white/50 font-sans">
          Every contribution keeps QuoteApp free and growing 🙏
        </p>
      </div>

      {/* Bank card */}
      <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500/15 to-purple-500/10 border-b border-white/8">
          <div className="h-8 w-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
            <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white font-sans">Capitec Bank Transfer</p>
            <p className="text-[11px] text-white/45 font-sans">Send any amount you&apos;re comfortable with</p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold text-pink-300 bg-pink-500/15 border border-pink-500/30 rounded-full px-2.5 py-0.5">
            Free Will
          </span>
        </div>

        {/* Fields */}
        <div className="px-4 py-1">
          {BANK_FIELDS.map((f) => (
            <CopyField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        {/* Copy all button */}
        <div className="px-4 pb-4 pt-2">
          <button
            onClick={handleCopyAll}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              allCopied
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/8 hover:bg-white/14 text-white/70 hover:text-white border-white/12 active:scale-98"
            }`}
          >
            {allCopied ? (
              <><Check className="h-4 w-4" /> All details copied!</>
            ) : (
              <><Copy className="h-4 w-4" /> Copy all details</>
            )}
          </button>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-[11px] text-white/30 font-sans">
        Use Capitec app → Send → Enter phone number or account number
      </p>
    </div>
  )
}
