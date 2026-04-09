'use client'

import { Share2, Download } from 'lucide-react'
import { categoryCanvasGradients, categoryColors } from '@/lib/category-colors'

interface SocialShareImageProps {
  content: {
    type: 'quote' | 'bible' | 'study'
    id: number
    title?: string
    text: string
    author?: string
    category: string
    reference?: string
    lesson?: string
    tip?: string
  }
}

interface SocialPlatform {
  name: string
  icon: string
  color: string
}

const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  facebook: { name: 'Facebook', icon: 'f', color: '#1877F2' },
  instagram: { name: 'Instagram', icon: '📷', color: '#E1306C' },
  tiktok: { name: 'TikTok', icon: '♪', color: '#000000' },
  whatsapp: { name: 'WhatsApp', icon: '💬', color: '#25D366' },
}

export function SocialShareImage({ content }: SocialShareImageProps) {
  const shareToSocial = async (platform: string) => {
    try {
      const blob = await generateImageBlob()
      if (!blob) return

      const filename = `${content.type}-${content.id}.png`
      const file = new File([blob], filename, { type: 'image/png' })

      const shareData: any = {
        files: [file],
        title: content.type === 'quote' ? content.author : content.title,
        text: content.type === 'quote' ? content.text : content.title,
      }

      // Try Web Share API first (works on mobile)
      if (navigator.share && navigator.canShare?.(shareData)) {
        try {
          await navigator.share(shareData)
          return
        } catch (err) {
          // User cancelled or share failed - fallback below
        }
      }

      // Fallback: Download the image for manual sharing
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error sharing to social:', error)
    }
  }

  const generateImageBlob = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        let canvas = document.createElement('canvas')
        canvas.width = 1080
        canvas.height = 1350

        const ctx = canvas.getContext('2d')!

        // Set up gradient based on type
        let gradient
        if (content.type === 'bible') {
          gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
          gradient.addColorStop(0, '#1e1b4b')
          gradient.addColorStop(0.4, '#4c1d95')
          gradient.addColorStop(0.7, '#6366f1')
          gradient.addColorStop(1, '#a855f7')
        } else if (content.type === 'study') {
          gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
          gradient.addColorStop(0, '#7c2d12')
          gradient.addColorStop(0.4, '#b45309')
          gradient.addColorStop(0.7, '#ea580c')
          gradient.addColorStop(1, '#f97316')
        } else {
          // Quote
          const colors = categoryCanvasGradients[content.category] || categoryCanvasGradients.all
          gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
          gradient.addColorStop(0, colors[0])
          gradient.addColorStop(0.5, colors[1])
          gradient.addColorStop(1, colors[2])
        }

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 1080, 1350)

        // Card background
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.fillRect(80, 120, 920, 1110)

        let y = 200

        // Render based on type
        if (content.type === 'quote') {
          // Quote rendering
          ctx.fillStyle = 'rgba(255,255,255,0.95)'
          ctx.font = 'bold 48px "Georgia", serif'
          ctx.textAlign = 'center'

          const words = content.text.split(' ')
          let line = ''
          let lines: string[] = []

          for (const word of words) {
            const testLine = line + word + ' '
            const metrics = ctx.measureText(testLine)
            if (metrics.width > 800 && line) {
              lines.push(line.trim())
              line = word + ' '
            } else {
              line = testLine
            }
          }
          if (line) lines.push(line.trim())

          lines.forEach(l => {
            ctx.fillText(`"${l}"`, 540, y)
            y += 60
          })

          y += 40
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.font = '500 32px "Georgia", serif'
          ctx.fillText(`— ${content.author}`, 540, y)
        } else if (content.type === 'bible') {
          // Bible Insights rendering
          ctx.fillStyle = 'rgba(255,255,255,0.95)'
          ctx.font = 'bold 54px "Georgia", serif'
          ctx.textAlign = 'center'
          ctx.fillText(content.title || 'Bible Insight', 540, y)
          y += 70

          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          ctx.font = '600 28px "Garamond", serif'
          ctx.fillText(`📖 ${content.reference}`, 540, y)
          y += 70

          ctx.fillStyle = 'rgba(255,255,255,0.92)'
          ctx.font = 'italic 30px "Palatino", serif'
          const lessonWords = content.lesson!.split(' ')
          let lessonLine = ''
          let lessonLines: string[] = []

          for (const word of lessonWords) {
            const testLine = lessonLine + word + ' '
            const metrics = ctx.measureText(testLine)
            if (metrics.width > 760 && lessonLine) {
              lessonLines.push(lessonLine.trim())
              lessonLine = word + ' '
            } else {
              lessonLine = testLine
            }
          }
          if (lessonLine) lessonLines.push(lessonLine.trim())

          lessonLines.forEach(l => {
            ctx.fillText(`"${l}"`, 540, y)
            y += 45
          })
        } else {
          // Study Tips rendering
          ctx.fillStyle = 'rgba(255,255,255,0.95)'
          ctx.font = 'bold 54px "Georgia", serif'
          ctx.textAlign = 'center'
          ctx.fillText(content.title || 'Study Tip', 540, y)
          y += 70

          ctx.fillStyle = 'rgba(255,255,255,0.9)'
          ctx.font = '700 24px "Arial", sans-serif'
          ctx.fillText(`⚡ ${content.category.toUpperCase()} ⚡`, 540, y)
          y += 70

          ctx.fillStyle = 'rgba(255,255,255,0.88)'
          ctx.font = 'italic 24px "Trebuchet MS", sans-serif'
          const tipWords = (content.tip || '').split(' ')
          let tipLine = ''
          let tipLines: string[] = []

          for (const word of tipWords) {
            const testLine = tipLine + word + ' '
            const metrics = ctx.measureText(testLine)
            if (metrics.width > 760 && tipLine) {
              tipLines.push(tipLine.trim())
              tipLine = word + ' '
            } else {
              tipLine = testLine
            }
          }
          if (tipLine) tipLines.push(tipLine.trim())

          tipLines.forEach(l => {
            ctx.fillText(l, 540, y)
            y += 38
          })
        }

        // Logo
        ctx.fillStyle = 'rgba(255,255,255,0.30)'
        ctx.font = '600 20px "Georgia", serif'
        ctx.textAlign = 'center'
        ctx.fillText('✦ ~ Quote.app ~ ✦', 540, 1300)

        canvas.toBlob((blob) => {
          resolve(blob)
        })
      } catch (error) {
        console.error('Error generating image blob:', error)
        resolve(null)
      }
    })
  }

  const handleDownload = async () => {
    try {
      const blob = await generateImageBlob()
      if (!blob) return

      const filename = `${content.type}-${content.id}.png`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Social Media Icons */}
      <div className="flex gap-3 justify-center flex-wrap">
        {/* Facebook */}
        <button
          onClick={() => shareToSocial('facebook')}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <span className="text-xl">f</span>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Facebook
          </div>
        </button>

        {/* Instagram */}
        <button
          onClick={() => shareToSocial('instagram')}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Share on Instagram"
          title="Share on Instagram"
        >
          <span className="text-xl">📷</span>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Instagram
          </div>
        </button>

        {/* TikTok */}
        <button
          onClick={() => shareToSocial('tiktok')}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Share on TikTok"
          title="Share on TikTok"
        >
          <span className="text-xl">♪</span>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            TikTok
          </div>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => shareToSocial('whatsapp')}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <span className="text-xl">💬</span>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp
          </div>
        </button>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold transition-all active:scale-95"
        aria-label="Download as image"
      >
        <Download className="h-5 w-5" />
        Download Image
      </button>

      {/* Info text */}
      <p className="text-center text-xs text-white/60">
        Tap a social icon to share the image. On mobile, you'll see available apps to share with.
      </p>
    </div>
  )
}
