'use client'

import { useState } from 'react'
import SectionIntro from '@/components/landing/ui/SectionIntro'
import UnblockedMark from '@/components/landing/ui/UnblockedMark'
import { DEMO_PRIORITIES, ENGINE_STAGES, MEASURE_SERIES } from '@/lib/landing/demo-data'

export default function UnblockedAIEngine() {
  const [active, setActive] = useState(ENGINE_STAGES[0].id)
  const stage = ENGINE_STAGES.find((item) => item.id === active) ?? ENGINE_STAGES[0]

  return (
    <section id="unblocked-ai" className="landing-section bg-su-ink text-white">
      <div className="landing-container">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionIntro
              eyebrow="Meet UnblockedAI"
              tone="dark"
              title="Your AI analyst for the revenue organization."
            >
              <span className="text-white/70">
                UnblockedAI turns thousands of seller signals into a continuous understanding of what is making revenue
                harder — and what leadership should do next.
              </span>
            </SectionIntro>
            <div className="mt-8 hidden flex-col gap-2 lg:flex" role="tablist" aria-label="UnblockedAI stages">
              {ENGINE_STAGES.map((item) => {
                const selected = item.id === active
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(item.id)}
                    className={`landing-focus-ring rounded-2xl border px-4 py-3 text-left motion-safe:transition-colors ${
                      selected ? 'border-su-blue/70 bg-white/5' : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <span className="landing-mono text-su-blueBright">{item.index}</span>
                    <span className="ml-3 text-sm font-semibold uppercase tracking-[0.12em]">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="hidden lg:block" role="tabpanel">
              <StageCopy stage={stage} />
              <StagePreview id={stage.id} />
            </div>
            <div className="grid gap-10 lg:hidden">
              {ENGINE_STAGES.map((item) => (
                <article key={item.id}>
                  <StageCopy stage={item} />
                  <StagePreview id={item.id} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StageCopy({ stage }: { stage: (typeof ENGINE_STAGES)[number] }) {
  return (
    <div className="mb-5">
      <p className="landing-mono text-su-blueBright lg:hidden">
        {stage.index} {stage.name}
      </p>
      <h3 className="mt-2 hidden text-xl font-semibold tracking-tight lg:block">{stage.name}</h3>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">{stage.body}</p>
    </div>
  )
}

function StagePreview({ id }: { id: string }) {
  if (id === 'listen') {
    return (
      <div className="landing-card-dark p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">Seller</p>
        <p className="mt-2 text-sm text-white">Pricing approvals take forever.</p>
        <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-su-blueBright">
          <UnblockedMark tone="light" /> follow-up
        </p>
        <p className="mt-2 text-sm text-white">Which part creates the most friction?</p>
        <p className="mt-3 text-sm text-white/70">I don’t know when approval is required.</p>
      </div>
    )
  }

  if (id === 'understand') {
    const fragments = ['Two regions, two paths', 'Unclear Deal Desk trigger', 'Late-stage delay', 'North America enterprise']
    return (
      <div className="landing-card-dark p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {fragments.map((fragment) => (
            <span key={fragment} className="rounded-full border border-white/10 px-3 py-2 text-[13px] text-white/75">
              {fragment}
            </span>
          ))}
        </div>
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="landing-mono text-su-blueBright">One issue</p>
          <p className="mt-2 text-sm font-medium text-white">{DEMO_PRIORITIES[0].shortTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{DEMO_PRIORITIES[0].diagnosis}</p>
        </div>
      </div>
    )
  }

  if (id === 'prioritize') {
    return (
      <ol className="landing-card-dark divide-y divide-white/10">
        {DEMO_PRIORITIES.slice(0, 3).map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <p className="landing-mono text-white/40">{String(item.rank).padStart(2, '0')}</p>
              <p className="mt-1 text-sm font-medium text-white">{item.shortTitle}</p>
            </div>
            <p className="landing-nums shrink-0 text-right text-[12px] text-white/60">
              {item.priority}
              <span className="mt-1 block">{item.signalCount} signals</span>
            </p>
          </li>
        ))}
      </ol>
    )
  }

  if (id === 'act') {
    const item = DEMO_PRIORITIES[1]
    return (
      <div className="landing-card-dark grid gap-px bg-white/10 sm:grid-cols-3">
        {[
          ['Issue', item.shortTitle],
          ['Action', item.recommendation],
          ['Owner', item.owner],
        ].map(([label, value]) => (
          <div key={label} className="bg-su-ink2 p-5">
            <p className="landing-mono text-white/40">{label}</p>
            <p className="mt-2 text-sm leading-relaxed text-white">{value}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="landing-card-dark p-5 sm:p-6">
      <p className="landing-mono text-white/45">Pricing-approval mentions · enterprise</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {MEASURE_SERIES.map((point) => (
          <div key={point.label}>
            <div className="flex h-28 items-end rounded-xl bg-white/5 px-2">
              <div className="w-full rounded-t-md bg-su-blue" style={{ height: `${point.value * 2.4}%` }} />
            </div>
            <p className="mt-2 text-[12px] text-white/55">{point.label}</p>
            <p className="landing-nums text-sm text-white">{point.value}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}
