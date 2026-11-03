'use client'

import { useState } from 'react'
import SectionIntro from '@/components/landing/ui/SectionIntro'
import { FRICTION_ZONES } from '@/lib/landing/demo-data'

export default function FrictionUniverse() {
  const [active, setActive] = useState(FRICTION_ZONES[0].id)
  const zone = FRICTION_ZONES.find((item) => item.id === active) ?? FRICTION_ZONES[0]
  const centerIndex = 4

  const cells = [
    FRICTION_ZONES[0],
    FRICTION_ZONES[1],
    FRICTION_ZONES[2],
    FRICTION_ZONES[3],
    null,
    FRICTION_ZONES[4],
    FRICTION_ZONES[5],
    FRICTION_ZONES[6],
    FRICTION_ZONES[7],
  ]

  return (
    <section className="landing-section bg-su-cream">
      <div className="landing-container">
        <SectionIntro title="Revenue friction hides in places call intelligence can’t fully see.">
          SellerUnblocked continuously gathers structured and qualitative signals from sellers to reveal the operating
          issues that show up in their work every day.
        </SectionIntro>

        <div className="mt-8 flex flex-wrap gap-2 lg:hidden" role="tablist" aria-label="Friction areas">
          {FRICTION_ZONES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === active}
              className={`landing-focus-ring min-h-11 rounded-full border px-4 text-sm ${
                item.id === active ? 'border-su-ink bg-su-ink text-white' : 'border-su-text/15 bg-white text-su-text'
              }`}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-10 hidden grid-cols-3 gap-3 lg:grid" aria-hidden={false}>
          {cells.map((item, index) => {
            if (!item) {
              return (
                <div
                  key="center"
                  className="flex min-h-36 items-center justify-center rounded-[20px] bg-su-ink px-4 text-center text-white"
                >
                  <div>
                    <p className="landing-mono text-su-blueBright">Center</p>
                    <p className="mt-2 text-sm font-semibold tracking-[0.14em]">SELLER EXPERIENCE</p>
                  </div>
                </div>
              )
            }
            const selected = item.id === active
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setActive(item.id)}
                onFocus={() => setActive(item.id)}
                className={`landing-focus-ring min-h-36 rounded-[20px] border px-5 py-4 text-left motion-safe:transition-colors ${
                  selected ? 'border-su-blue bg-white' : 'border-su-text/10 bg-white/70 hover:bg-white'
                }`}
              >
                <span className="landing-mono text-su-muted">{String((index < centerIndex ? index : index - 1) + 1).padStart(2, '0')}</span>
                <span className="mt-3 block text-base font-semibold text-su-text">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-[20px] border border-su-text/10 bg-white p-6 sm:p-8" aria-live="polite">
          <p className="landing-mono text-su-blueText">{zone.label}</p>
          <h3 className="landing-h3 mt-3 text-su-text">What sellers run into</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {zone.examples.map((example) => (
              <li key={example} className="border-t border-su-text/10 pt-3 text-sm text-su-text">
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
