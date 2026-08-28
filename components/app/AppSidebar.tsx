'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EXEC_NAV } from '@/lib/nav/exec'
import { REP_NAV } from '@/lib/nav/rep'
import type { PortalId } from '@/components/app/AppShell'

type Props = {
  portal: PortalId
  portalHomeHref: string
  mobileOpen: boolean
  onClose: () => void
}

export default function AppSidebar({ portal, portalHomeHref, mobileOpen, onClose }: Props) {
  const pathname = usePathname()
  const navItems = portal === 'rep' ? REP_NAV : EXEC_NAV

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden transition-opacity ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
        onClick={onClose}
      />
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-[260px] shrink-0 border-r border-warm-400/20 bg-white/95 backdrop-blur-md flex flex-col shadow-[4px_0_24px_rgba(12,15,20,0.04)] transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-[76px] px-5 flex items-center gap-3 border-b border-warm-400/20 bg-gradient-to-r from-accent-soft/30 to-white">
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft/80 ring-1 ring-accent/20"
            aria-hidden
          >
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
              <path
                d="M7.5 23.5 L19.2 12.2"
                stroke="#0c0f14"
                strokeWidth="2.75"
                strokeLinecap="round"
              />
              <circle cx="22" cy="10" r="3" fill="#7cb9e8" />
            </svg>
          </span>
          <Link href={portalHomeHref} className="text-[1.05rem] font-semibold tracking-tight text-ink" onClick={onClose}>
            SellerUnblocked
          </Link>
        </div>
        {portal === 'rep' ? (
          <div className="px-4 py-3 border-b border-warm-400/15">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-dark">
              Your seller center
            </p>
            <p className="text-xs text-warm-500 mt-0.5">Private · based on your feedback</p>
          </div>
        ) : null}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl py-2.5 pr-3 pl-2.5 text-sm font-medium transition-all border-l-[3px] ${
                  active
                    ? 'border-accent-dark bg-accent-soft/70 text-ink shadow-sm'
                    : 'border-transparent text-warm-600 hover:bg-accent-soft/35 hover:text-ink'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? 'text-accent-dark' : 'opacity-80'}`}
                  strokeWidth={1.75}
                />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-warm-400/30 space-y-2">
          <Link
            href={portal === 'rep' ? '/app/overview' : '/rep/home'}
            className="block text-xs font-medium text-accent-dark hover:text-ink transition-colors"
            onClick={onClose}
          >
            {portal === 'rep' ? '→ Leadership dashboard' : '→ Seller center (demo)'}
          </Link>
          <Link
            href="/"
            className="block text-xs font-medium text-warm-500 hover:text-ink transition-colors"
            onClick={onClose}
          >
            ← Marketing site
          </Link>
        </div>
      </aside>
    </>
  )
}
