'use client'

import { useState } from 'react'
import UnblockedMark from '@/components/landing/ui/UnblockedMark'
import { DEMO_META, DEMO_PRIORITIES, HERO_ANSWER_IDS, answerById } from '@/lib/landing/demo-data'

const HERO_PRIORITIES = DEMO_PRIORITIES.slice(0, 3)
const DELAYS = ['landing-d2', 'landing-d3', 'landing-d4']

export default function UnblockedAIHeroDemo() {
  const [answerId, setAnswerId] = useState<(typeof HERO_ANSWER_IDS)[number]>('fix-first')
  const [showEvidence, setShowEvidence] = useState(false)
  const [brief, setBrief] = useState(false)
  const answer = answerById(answerId)

  function select(id: (typeof HERO_ANSWER_IDS)[number]) {
    setAnswerId(id)
    setShowEvidence(false)
    setBrief(false)
  }

  return (
    <div className="landing-product-frame-light text-su-text" aria-label="UnblockedAI workspace">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-su-text/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-su-ink">SellerUnblocked</span>
          <span className="hidden h-3 w-px bg-su-text/15 sm:block" aria-hidden />
          <UnblockedMark tone="dark" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-su-secondary">
          <span className="landing-mono">{DEMO_META.period}</span>
          <span className="landing-motion landing-d1 landing-nums font-medium text-su-blueText">
            {DEMO_META.signalCount} seller signals analyzed
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.9fr)]">
        <div className="border-b border-su-text/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="landing-mono text-su-muted">What I’m seeing</p>
          <ol className="mt-3 divide-y divide-su-text/10">
            {HERO_PRIORITIES.map((item, index) => (
              <li
                key={item.id}
                className={`landing-motion ${DELAYS[index]} py-4 first:pt-2 ${index === 2 ? 'max-sm:hidden' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="landing-mono text-su-blueText">{String(item.rank).padStart(2, '0')}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-su-secondary">{item.priority}</span>
                  <span className="landing-nums text-[12px] text-su-secondary">{item.signalCount} seller signals</span>
                </div>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-su-ink sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-su-secondary">{item.diagnosis}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-su-text">
                  <span className="text-su-muted">Recommendation. </span>
                  {item.recommendation}
                </p>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-su-secondary">
                  <span>{item.segments.join(' · ')}</span>
                  <span className="landing-nums">{item.trendLabel}</span>
                  <span>
                    Owner <span className="font-medium text-su-ink">{item.owner}</span>
                  </span>
                </p>
              </li>
            ))}
          </ol>
          <p className="landing-mono pb-1 text-su-muted sm:hidden">Third priority is in the full priority list below.</p>
        </div>

        <aside className="landing-motion landing-d5 bg-su-paper/70 p-4 sm:p-5">
          <p className="text-sm font-semibold text-su-ink">
            Ask <UnblockedMark tone="dark" />
          </p>
          <p className="mt-3 rounded-2xl border border-su-text/10 bg-white px-3 py-3 text-sm text-su-muted">
            Ask anything about your revenue organization…
          </p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Sample questions">
            {HERO_ANSWER_IDS.map((id) => {
              const item = answerById(id)
              const selected = id === answerId
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => select(id)}
                  className={`landing-focus-ring min-h-11 rounded-full border px-3 text-left text-[13px] leading-tight motion-safe:transition-colors ${
                    selected
                      ? 'border-su-blueText bg-su-blueSoft text-su-ink'
                      : 'border-su-text/15 bg-white text-su-secondary hover:border-su-text/30 hover:text-su-ink'
                  }`}
                >
                  {item.chip}
                </button>
              )
            })}
          </div>
          <div className="mt-4" aria-live="polite">
            <p className="text-sm font-medium leading-relaxed text-su-ink">{answer.lead}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-su-secondary">
              <span className="landing-nums">{answer.evidenceCount} signals</span>
              {' · '}
              {answer.segments.join(', ')}
              {' · '}
              {answer.trend}
            </p>
            <p className="mt-2 text-[13px] text-su-secondary">
              Recommended owner: <span className="font-medium text-su-ink">{answer.owner}</span>
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-expanded={showEvidence}
              onClick={() => setShowEvidence((value) => !value)}
              className="landing-focus-ring min-h-11 rounded-full border border-su-text/15 bg-white px-4 text-sm text-su-ink hover:bg-su-paper"
            >
              {showEvidence ? 'Hide evidence' : 'View evidence'}
            </button>
            <button
              type="button"
              aria-pressed={brief}
              onClick={() => setBrief(true)}
              className="landing-focus-ring min-h-11 rounded-full bg-su-ink px-4 text-sm font-semibold text-white hover:bg-su-ink2"
            >
              Create action brief
            </button>
          </div>
          {showEvidence ? (
            <ul className="mt-4 space-y-2 border-t border-su-text/10 pt-3">
              {answer.snippets.map((snippet) => (
                <li key={snippet} className="text-[13px] leading-relaxed text-su-secondary">
                  “{snippet}”
                </li>
              ))}
            </ul>
          ) : null}
          {brief ? (
            <p className="mt-3 text-[13px] leading-relaxed text-su-blueText">
              Sample brief drafted for {answer.owner}. This demo does not save or send it.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
