import Link from 'next/link'
import HeroDualMock from '@/components/HeroDualMock'

const BULLETS = [
  'Diagnose the operational barriers slowing down sellers',
  'Prioritize system-level fixes with leadership intelligence',
  'Deliver private, personalized enablement kits to every seller',
  'Triangulate CRM, calls, calendar, and content — then ask sellers only what systems cannot answer',
]

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-ink bg-hero-gradient bg-[length:100%_100%] section-padding">
      <div className="absolute inset-0 bg-grid-subtle bg-[size:48px_48px] opacity-40 pointer-events-none" aria-hidden />
      <div className="relative container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-light mb-5">
              AI-Powered Seller Optimization Platform
            </p>
            <h1 className="text-display font-bold text-white tracking-tight [text-wrap:balance]">
              Find the Friction. Fix the System. Help Every Seller Win.
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-accent-light/95 font-medium max-w-xl mx-auto lg:mx-0 leading-snug">
              Maximize seller effectiveness by removing friction.
            </p>
            <p className="mt-6 text-lg sm:text-xl text-warm-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Seller Unblocked finds what prevents sellers from selling, fixes what it can, and shows leadership what
              needs to change. Leadership still gets org intelligence. Every seller still gets a private enablement kit.
            </p>
            <ul className="mt-10 grid gap-3 max-w-lg mx-auto lg:mx-0">
              {BULLETS.map((text) => (
                <li
                  key={text}
                  className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3.5 text-left text-sm text-white/90"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-light" aria-hidden />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="#final-cta"
                className="inline-flex rounded-full bg-accent px-8 py-4 text-base font-semibold text-white hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
              >
                Book a 20-Minute Overview
              </Link>
              <Link
                href="#enablement-kits"
                className="inline-flex rounded-full border-2 border-warm-500/80 px-8 py-4 text-base font-semibold text-white hover:border-warm-400 hover:bg-white/5 transition-colors"
              >
                See Enablement Kits
              </Link>
            </div>
            <p className="mt-8 text-sm text-warm-500 uppercase tracking-wider">
              Built for modern revenue organizations with 100+ sellers
            </p>
          </div>
          <HeroDualMock className="max-w-md mx-auto lg:max-w-none lg:ml-auto w-full" />
        </div>
      </div>
    </section>
  )
}
