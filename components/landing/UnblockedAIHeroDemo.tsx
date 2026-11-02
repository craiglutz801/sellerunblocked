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
    <div className="landing-product-frame text-white" aria-label="UnblockedAI workspace">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-sm font-semibold tracking-tight">SellerUnblocked</span>
          <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
          <UnblockedMark tone="light" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/60">
          <span className="landing-mono text-white/60">{DEMO_META.period}</span>
          <span className="landing-motion landing-d1 landing-nums text-su-blueBright">
            {DEMO_META.signalCount} seller signals analyzed
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.9fr)]">
        <div className="border-b border-white/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="landing-mono text-white/50">What I’m seeing</p>
          <ol className="mt-3 divide-y divide-white/10">
            {HERO_PRIORITIES.map((item, index) => (
              <li
                key={item.id}
                className={`landing-motion ${DELAYS[index]} py-4 first:pt-2 ${index === 2 ? 'max-sm:hidden' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="landing-mono text-su-blueBright">{String(item.rank).padStart(2, '0')}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">{item.priority}</span>
                  <span className="landing-nums text-[12px] text-white/55">{item.signalCount} seller signals</span>
                </div>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-white sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{item.diagnosis}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/80">
                  <span className="text-white/45">Recommendation. </span>
                  {item.recommendation}
                </p>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-white/55">
                  <span>{item.segments.join(' · ')}</span>
                  <span className="landing-nums">{item.trendLabel}</span>
                  <span>
                    Owner <span className="text-white">{item.owner}</span>
                  </span>
                </p>
              </li>
            ))}
          </ol>
          <p className="landing-mono pb-1 text-white/40 sm:hidden">Third priority is in the full priority list below.</p>
        </div>

        <aside className={`landing-motion landing-d5 p-4 sm:p-5 ${brief ? '' : ''}`}>
          <p className="text-sm font-semibold">
            Ask <UnblockedMark tone="light" />
          </p>
          <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/45">
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
                    selected ? 'border-su-blue bg-su-blue/15 text-white' : 'border-white/10 text-white/75 hover:border-white/30'
                  }`}
                >
                  {item.chip}
                </button>
              )
            })}
          </div>
          <div className="mt-4" aria-live="polite">
            <p className="text-sm font-medium leading-relaxed text-white">{answer.lead}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">
              <span className="landing-nums">{answer.evidenceCount} signals</span>
              {' · '}
              {answer.segments.join(', ')}
              {' · '}
              {answer.trend}
            </p>
            <p className="mt-2 text-[13px] text-white/75">
              Recommended owner: <span className="text-white">{answer.owner}</span>
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-expanded={showEvidence}
              onClick={() => setShowEvidence((value) => !value)}
              className="landing-focus-ring min-h-11 rounded-full border border-white/15 px-4 text-sm text-white hover:bg-white/10"
            >
              {showEvidence ? 'Hide evidence' : 'View evidence'}
            </button>
            <button
              type="button"
              aria-pressed={brief}
              onClick={() => setBrief(true)}
              className="landing-focus-ring min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-su-ink hover:bg-su-blueSoft"
            >
              Create action brief
            </button>
          </div>
          {showEvidence ? (
            <ul className="mt-4 space-y-2 border-t border-white/10 pt-3">
              {answer.snippets.map((snippet) => (
                <li key={snippet} className="text-[13px] leading-relaxed text-white/70">
                  “{snippet}”
                </li>
              ))}
            </ul>
          ) : null}
          {brief ? (
            <p className="mt-3 text-[13px] leading-relaxed text-su-blueBright">
              Sample brief drafted for {answer.owner}. This demo does not save or send it.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
