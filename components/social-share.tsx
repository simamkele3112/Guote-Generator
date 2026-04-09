"use client"

import { Download } from "lucide-react"

interface SocialShareProps {
  quote: {
    id: number
    text: string
    author: string
    category: string
  }
  onDownload?: () => void
}

export function SocialShare({ quote, onDownload }: SocialShareProps) {
  const shareText = `"${quote.text}" — ${quote.author}\n\nShared via QuoteApp`
  const encodedText = encodeURIComponent(shareText)

  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: "💬",
      href: `https://wa.me/?text=${encodedText}`,
      color: "bg-green-600/20 hover:bg-green-600/30 border-green-600/30 hover:border-green-600/50",
    },
    {
      name: "Twitter",
      icon: "𝕏",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      color: "bg-black/20 hover:bg-black/30 border-white/20 hover:border-white/30",
    },
    {
      name: "Facebook",
      icon: "f",
      href: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
      color: "bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/30 hover:border-blue-600/50",
    },
    {
      name: "Instagram",
      icon: "📸",
      href: "#",
      onClick: onDownload,
      color: "bg-pink-600/20 hover:bg-pink-600/30 border-pink-600/30 hover:border-pink-600/50",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.href}
          onClick={(e) => {
            if (platform.onClick) {
              e.preventDefault()
              platform.onClick()
            }
          }}
          target={platform.href === "#" ? undefined : "_blank"}
          rel={platform.href === "#" ? undefined : "noopener noreferrer"}
          className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-all active:scale-95 ${platform.color}`}
          aria-label={`Share on ${platform.name}`}
        >
          <span className="text-2xl">{platform.icon}</span>
          <span className="text-xs font-medium text-white/80">{platform.name}</span>
        </a>
      ))}
    </div>
  )
}
