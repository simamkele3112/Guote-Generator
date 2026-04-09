"use client"

import { Crown, Zap, BarChart3, TrendingUp } from "lucide-react"

export function MonetizationInfo() {
  const strategies = [
    {
      title: "Premium Subscription",
      description: "Unlimited quotes, no ads, exclusive features",
      price: "$2.99/month or $19.99/year",
      benefits: ["Unlimited daily quotes", "Ad-free experience", "Exclusive categories", "Advanced stats"],
      icon: Crown,
    },
    {
      title: "Non-invasive Ads",
      description: "Subtle banner ads for free users",
      revenue: "CPM-based advertising",
      benefits: ["Between-session ads", "Reward video option", "Respects user experience"],
      icon: BarChart3,
    },
    {
      title: "Affiliate Links",
      description: "Books, courses, and productivity tools",
      revenue: "Commission-based",
      benefits: ["Curated recommendations", "5-50% commissions", "Related to quotes"],
      icon: TrendingUp,
    },
    {
      title: "Premium Features",
      description: "Pay-per-feature monetization",
      revenue: "One-time purchases",
      benefits: ["Quote scheduling", "Custom themes", "Export to PDF", "Analytics"],
      icon: Zap,
    },
  ]

  return (
    <div>
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <h3 className="font-semibold text-white mb-2">Monetization Strategy</h3>
        <p className="text-sm text-white/70">
          Multi-channel approach prioritizing user experience while generating revenue
        </p>
      </div>

      <div className="space-y-3">
        {strategies.map((strategy, index) => {
          const Icon = strategy.icon
          return (
            <div key={index} className="p-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{strategy.title}</h4>
                  <p className="text-xs text-white/60">{strategy.description}</p>
                  <p className="text-xs text-amber-400 mt-1 font-medium">
                    {strategy.price || strategy.revenue}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {strategy.benefits.map((benefit, i) => (
                  <div key={i} className="text-xs text-white/70 flex items-start gap-2">
                    <span className="text-white/40 mt-1">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-200">
          💡 <strong>Pro Tip:</strong> Free tier limits drive premium conversions. Current setup: 3 free quotes/day encourages upgrade after 3-5 days.
        </p>
      </div>
    </div>
  )
}
