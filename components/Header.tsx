'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { label: 'Product', href: '#solution' },
  { label: 'Enablement Kits', href: '#enablement-kits' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'ROI', href: '#roi' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/90 backdrop-blur-md border-b border-warm-400/30">
      <div className="container-max flex items-center justify-between gap-4 py-4 md:py-5 px-5 sm:px-8 md:px-12 lg:px-16">
        <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
          SellerUnblocked
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-warm-600 hover:text-ink transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#enablement-kits"
            className="hidden md:inline text-sm font-medium text-accent-dark hover:text-ink transition-colors"
          >
            See IC Kits
          </a>
          <Link
            href="#final-cta"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Book Overview
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warm-400/30 text-ink"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <nav className="lg:hidden border-t border-warm-400/20 bg-paper px-5 py-4 space-y-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-warm-600 hover:bg-cream hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
