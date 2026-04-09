"use client"

import { useState } from "react"
import { X, CreditCard, CheckCircle2, Lock, Smartphone, Zap, Building2 } from "lucide-react"

interface PaymentModalProps {
  onClose: () => void
  onSuccess: () => void
}

type Plan = "monthly" | "yearly"
type PaymentMethod = "payfast" | "snapscan" | "ozow" | "capitec"

const PLANS = {
  monthly: { price: "R30",  period: "/ month", sub: "Billed every month",         save: null         },
  yearly:  { price: "R360", period: "/ year",  sub: "~R30/mo · Billed annually",  save: "Best Value" },
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string; color: string; Icon: React.ElementType }[] = [
  { id: "payfast",  label: "PayFast",      description: "Card, EFT, SnapScan & more",  color: "from-blue-600 to-blue-700",     Icon: CreditCard  },
  { id: "snapscan", label: "SnapScan",     description: "Scan QR with SnapScan app",   color: "from-red-500 to-red-600",       Icon: Smartphone  },
  { id: "ozow",     label: "Ozow / EFT",  description: "Instant EFT · all SA banks",  color: "from-teal-500 to-teal-600",     Icon: Zap         },
  { id: "capitec",  label: "Capitec Pay", description: "Pay via Capitec banking app", color: "from-purple-600 to-purple-700", Icon: Building2   },
]

export function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("yearly")
  const [step, setStep] = useState<"plans" | "checkout" | "success">("plans")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Keep for backward compat references below
  const plans = PLANS

  const handleProceed = () => setStep("checkout")

  const handlePay = async () => {
    if (!selectedMethod) return
    setIsProcessing(true)
    // TODO: Integrate real SA payment gateway:
    //   PayFast:   POST /api/payfast/initiate  → redirect to PayFast hosted page
    //   SnapScan:  GET  /api/snapscan/qr       → show QR code
    //   Ozow:      POST /api/ozow/initiate     → redirect to Ozow portal
    //   Capitec:   POST /api/capitec/initiate  → redirect to Capitec Pay
    await new Promise((r) => setTimeout(r, 1800))
    setIsProcessing(false)
    setStep("success")
    setTimeout(() => {
      onSuccess()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-serif text-2xl font-bold text-white">
            {step === "success" ? "🎉 Welcome to Premium!" : "Upgrade to Premium"}
          </h2>
          {step !== "success" && (
            <button onClick={onClose} className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/10 transition-all">
              <X className="h-5 w-5 text-white/60" />
            </button>
          )}
        </div>

        <div className="px-6 py-6 space-y-5">

          {/* ── PLAN SELECTION ── */}
          {step === "plans" && (
            <>
              <p className="text-sm text-white/70">Pick a plan. Cancel anytime.</p>

              <div className="space-y-3">
                {(["yearly", "monthly"] as Plan[]).map((plan) => {
                  const p = plans[plan]
                  const isSelected = selectedPlan === plan
                  return (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white capitalize">{plan}</span>
                            {p.save && (
                              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                                {p.save}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">{p.sub}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{p.price}</p>
                          <p className="text-xs text-white/50">{p.period}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-2 text-xs text-white/50">
                {["No ads, unlimited content", "Advanced stats & insights", "Cancel anytime from settings"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-base active:scale-95 transition-all"
              >
                Continue with {selectedPlan === "yearly" ? "R360 / year" : "R30 / month"}
              </button>

              <p className="text-center text-xs text-white/30">South African payment methods · Secure · Cancel anytime</p>
            </>
          )}

          {/* ── CHECKOUT: SA PAYMENT METHODS ── */}
          {step === "checkout" && (
            <>
              <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 rounded-xl px-3 py-2">
                <Lock className="h-3.5 w-3.5 text-green-400" />
                <span>South African payment methods · SSL secured</span>
              </div>

              <p className="text-sm text-white/70">Choose how you'd like to pay:</p>

              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ id, label, description, color, Icon }) => {
                  const isSelected = selectedMethod === id
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedMethod(id)}
                      className={`relative rounded-2xl p-4 text-left transition-all border ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-white leading-tight">{label}</p>
                      <p className="text-xs text-white/50 mt-0.5 leading-tight">{description}</p>
                      {isSelected && (
                        <CheckCircle2 className="absolute top-2.5 right-2.5 h-4 w-4 text-amber-400" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-sm text-white/70 bg-white/5 rounded-xl px-4 py-3">
                <span>Total today</span>
                <span className="font-bold text-white">{plans[selectedPlan].price}</span>
              </div>

              <button
                onClick={handlePay}
                disabled={!selectedMethod || isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-base active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay {plans[selectedPlan].price}
                  </>
                )}
              </button>

              <button onClick={() => setStep("plans")} className="w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors">
                ← Back to plans
              </button>
            </>
          )}

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="h-20 w-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Premium Unlocked!</p>
                <p className="text-sm text-white/60 mt-1">You now have unlimited access to all content with no ads.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full text-xs text-white/60">
                {["No ads", "Unlimited content", "Advanced stats", "Priority support"].map((f) => (
                  <div key={f} className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                    <CheckCircle2 className="h-3 w-3 text-green-400" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
