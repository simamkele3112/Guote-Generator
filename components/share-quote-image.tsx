'use client'

import { Share2 } from 'lucide-react'
import { categoryCanvasGradients } from '@/lib/category-colors'

interface ShareQuoteAsImageProps {
  quote: {
    text: string
    author: string
    category: string
  }
  onShare?: () => void
}

export function ShareQuoteAsImageButton({ quote, onShare }: ShareQuoteAsImageProps) {
  const generateQuoteImage = async () => {
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1350

    const ctx = canvas.getContext('2d')!

    // Get category-specific colors or use default
    const colors = categoryCanvasGradients[quote.category] || categoryCanvasGradients.all
    
    // Background gradient - category-specific
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.5, colors[1])
    gradient.addColorStop(1, colors[2])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1350)

    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.fillRect(0, 0, 1080, 1350)

    // Quote text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 56px "Georgia", serif'
    ctx.textAlign = 'center'

    // Word wrap for quote text
    const maxWidth = 900
    const lineHeight = 80
    const words = `"${quote.text}"`.split(' ')
    let line = ''
    let y = 300

    words.forEach((word) => {
      const testLine = line + word + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, 540, y)
        line = word + ' '
        y += lineHeight
      } else {
        line = testLine
      }
    })
    ctx.fillText(line, 540, y)

    // Author
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '400 40px "Georgia", serif'
    ctx.fillText(`— ${quote.author}`, 540, y + 120)

    // Category badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(340, 1100, 400, 80)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(quote.category.replace('-', ' ').toUpperCase(), 540, 1150)

    // Quote.app watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.font = '24px Arial'
    ctx.fillText('Quote.app', 540, 1300)

    return canvas
  }

  const handleShare = async () => {
    try {
      const canvas = await generateQuoteImage()

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return

        // Create share data
        const file = new File([blob], `quote-${quote.author}.png`, { type: 'image/png' })

        // Try native share API if available
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Beautiful Quote',
            text: `"${quote.text}" — ${quote.author}`,
          })
        } else {
          // Fallback: download
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `quote-${quote.author}.png`
          a.click()
          URL.revokeObjectURL(url)
        }

        onShare?.()
      })
    } catch (error) {
      console.error('Error sharing quote image:', error)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs text-white/70 hover:text-white/90 font-sans whitespace-nowrap"
      aria-label="Share quote as image"
    >
      <Share2 className="h-3 w-3" />
      <span className="hidden sm:inline">Share Image</span>
    </button>
  )
}
