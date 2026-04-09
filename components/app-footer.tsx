"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-white/5 py-6 px-4 backdrop-blur-sm">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Copyright */}
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} QuoteApp. All rights reserved.
          </p>

          {/* Social & Contact Links */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/privacy"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
              aria-label="Read our privacy policy"
            >
              Privacy
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/contact"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
              aria-label="Contact us"
            >
              Contact
            </Link>
            <span className="text-white/20">•</span>
            
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@sima_nkq?_r=1&_t=ZS-95DDjR5viMb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
              aria-label="Follow us on TikTok"
            >
              TikTok
            </a>
            <span className="text-white/20">•</span>
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/smah_nkq?igsh=NHRvYjlyYzc3bWZz&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white flex items-center gap-1"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-3 w-3" aria-hidden="true" />
              Instagram
            </a>

          </div>
        </div>
      </div>
    </footer>
  )
}
