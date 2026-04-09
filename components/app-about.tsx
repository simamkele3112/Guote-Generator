"use client"

import { Heart, Brain, Lightbulb, Zap } from "lucide-react"

export function AppAbout() {
  const features = [
    {
      icon: Brain,
      title: "Mental Clarity",
      description: "Daily quotes designed to calm your mind, reduce stress, and improve mental well-being",
    },
    {
      icon: Heart,
      title: "Emotional Health",
      description: "Thoughtful messages about love, relationships, and human connection",
    },
    {
      icon: Lightbulb,
      title: "Personal Growth",
      description: "Inspire yourself with wisdom about success, discipline, and life lessons",
    },
    {
      icon: Zap,
      title: "Daily Motivation",
      description: "Stay motivated with fresh quotes each day across 13+ carefully curated categories",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <h3 className="font-semibold text-white mb-2 text-lg">About QuoteApp</h3>
        <p className="text-sm text-white/80 leading-relaxed">
          QuoteApp is your daily companion for mental wellness, personal growth, and emotional health. We believe that the right words at the right time can transform your day, calm your mind, and inspire your journey.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase text-white/60 px-2">What We Offer</h4>
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="p-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{feature.title}</p>
                  <p className="text-xs text-white/70 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-white/60 text-center">
          Made with 💜 to help you live a better, healthier, and more meaningful life.
        </p>
      </div>
    </div>
  )
}
