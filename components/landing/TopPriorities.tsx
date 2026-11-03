'use client'

import { useState } from 'react'
import SectionIntro from '@/components/landing/ui/SectionIntro'
import { DEMO_META, DEMO_PRIORITIES } from '@/lib/landing/demo-data'
import type { DemoPriority } from '@/lib/landing/types'

export default function TopPriorities() {
  const [selected, setSelected] = useState(DEMO_PRIORITIES[0].id)
  const current = DEMO_PRIORITIES.find((item) => item.id === selected) ?? DEMO_PRIORITIES[0]

  return (
    <section id="product" className="landing-section bg-white">
      <div className="landing-container">
        <SectionIntro title="Not another dashboard. The five things most worth fixing.">
          SellerUnblocked converts noise into an opinionated, evidence-backed priority list for leadership.
        </SectionIntro>
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          <div className="landing-product-frame-light overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-su-text/10 px-4 py-3 sm:px-5">
              <p className="text-sm font-semibold text-su-text">Priority list</p>
              <span className="landing-mono text-su-muted">{DEMO_META.period}</span>
            </div>
            <div className="hidden grid-cols-[2.5rem_1.45fr_0.85fr_0.7fr_1.05fr_0.65fr] gap-3 border-b border-su-text/10 px-5 py-2 text-[11px] uppercase tracking-[0.12em] text-su-muted lg:grid">
              <span>#</span>
              <span>Issue</span>
              <span>Why now</span>
              <span>Affected</span>
              <span>Owner</span>
              <span>Status</span>
            </div>
            <ul>
              {DEMO_PRIORITIES.map((item) => {
                const on = item.id === selected
                return (
                  <li key={item.id} className="border-b border-su-text/10 last:border-b-0">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelected(item.id)}
                      className={`landing-focus-ring w-full px-4 py-4 text-left sm:px-5 ${on ? 'bg-su-blueSoft/70' : 'hover:bg-su-paper'}`}
                    >
                      <span className="grid gap-2 lg:grid-cols-[2.5rem_1.45fr_0.85fr_0.7fr_1.05fr_0.65fr] lg:items-center lg:gap-3">
                        <span className="landing-mono text-su-blueText">{String(item.rank).padStart(2, '0')}</span>
                        <span className="text-sm font-semibold text-su-text">{item.shortTitle}</span>
                        <span className="text-sm text-su-secondary">{item.whyNow}</span>
                        <span className="hidden text-sm text-su-secondary lg:block">{item.affected}</span>
                        <span className="hidden text-sm text-su-text lg:block">{item.owner}</span>
                        <span className="text-sm text-su-secondary">{item.status}</span>
                      </span>
                    </button>
                    {on ? (
                      <div className="px-4 pb-4 lg:hidden">
                        <Evidence item={item} />
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
          <aside className="landing-card sticky top-28 hidden p-6 lg:block" aria-live="polite">
            <Evidence item={current} />
          </aside>
        </div>
      </div>
    </section>
  )
}

function Evidence({ item }: { item: DemoPriority }) {
  return (
    <div>
      <p className="landing-mono text-su-blueText">Evidence</p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-su-text">{item.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-su-secondary">{item.diagnosis}</p>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-su-muted">Prevalence</dt>
          <dd className="landing-nums mt-1 font-medium text-su-text">{item.prevalence}</dd>
        </div>
        <div>
          <dt className="text-su-muted">Trend</dt>
          <dd className="mt-1 font-medium text-su-text">{item.trendLabel}</dd>
        </div>
        <div>
          <dt className="text-su-muted">Affected</dt>
          <dd className="mt-1 font-medium text-su-text">{item.segments.join(', ')}</dd>
        </div>
        <div>
          <dt className="text-su-muted">Confidence</dt>
          <dd className="mt-1 font-medium text-su-text">{item.confidence}</dd>
        </div>
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-su-secondary">{item.businessConsequence}</p>
      <ul className="mt-4 space-y-2">
        {item.snippets.map((snippet) => (
          <li key={snippet} className="border-t border-su-text/10 pt-2 text-sm leading-relaxed text-su-text">
            “{snippet}”
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-su-text">
        <span className="text-su-muted">Recommendation. </span>
        {item.recommendation}
      </p>
      <p className="mt-2 text-sm text-su-secondary">
        Suggested owner: <span className="font-medium text-su-text">{item.owner}</span>
      </p>
      <p className="mt-2 text-sm text-su-secondary">
        <span className="text-su-muted">Measure next. </span>
        {item.measureNext}
      </p>
    </div>
  )
}
