'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import BookDemoButton from '@/components/landing/ui/BookDemoButton'
import UnblockedMark from '@/components/landing/ui/UnblockedMark'

const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'UnblockedAI', href: '#unblocked-ai' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: "Who It's For", href: '#who-its-for' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.href.slice(1))).filter(
      (node): node is HTMLElement => Boolean(node),
    )
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.15, 0.4] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const light = !scrolled
  const linkClass = (href: string) => {
    const on = active === href.slice(1)
    if (light) return on ? 'text-white' : 'text-white/80 hover:text-white'
    return on ? 'text-su-ink' : 'text-su-text/80 hover:text-su-ink'
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 motion-safe:transition-colors motion-safe:duration-300 ${
        scrolled || open ? 'border-b border-su-text/10 bg-su-paper/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="landing-focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-su-ink"
      >
        Skip to content
      </a>
      <div className="landing-hero-container flex h-[4.5rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="landing-focus-ring min-w-0 rounded-md" aria-label="SellerUnblocked home">
          <span className={`block truncate text-[1.05rem] font-semibold tracking-tight ${light && !open ? 'text-white' : 'text-su-ink'}`}>
            SellerUnblocked
          </span>
          <span className={`mt-0.5 hidden text-[11px] font-medium lg:block ${light && !open ? 'text-white/65' : 'text-su-secondary'}`}>
            powered by <UnblockedMark tone={light && !open ? 'light' : 'dark'} />
          </span>
        </Link>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
              className={`landing-focus-ring text-sm font-medium motion-safe:transition-colors ${linkClass(item.href)}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#product"
            className={`landing-focus-ring hidden min-h-11 items-center rounded-full px-3 text-sm font-medium md:inline-flex ${
              light && !open ? 'text-white/85 hover:text-white' : 'text-su-secondary hover:text-su-ink'
            }`}
          >
            See the product
          </a>
          <BookDemoButton tone={light && !open ? 'dark' : 'light'} className="shrink-0 px-4 sm:px-5">
            Book a demo
          </BookDemoButton>
          <button
            type="button"
            className={`landing-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border xl:hidden ${
              light && !open ? 'border-white/20 text-white' : 'border-su-text/15 text-su-ink'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden className="text-lg leading-none">
              {open ? '×' : '☰'}
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-su-text/10 bg-su-paper px-5 py-4 xl:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="landing-focus-ring flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-su-text hover:bg-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#product"
              onClick={() => setOpen(false)}
              className="landing-focus-ring flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-su-secondary hover:bg-white md:hidden"
            >
              See the product
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
