import SectionEyebrow from '@/components/SectionEyebrow'
import {
  FLOW_STAGES,
  LEADERSHIP_BRANCH,
  SELLER_BRANCH,
} from '@/lib/landing/agentic'
import { Radio, GitBranch, Sparkles } from 'lucide-react'

const STAGE_ICONS = {
  signal: Radio,
  spine: GitBranch,
  action: Sparkles,
}

export default function AgenticActionLayer() {
  return (
    <section id="ai-action-layer" className="section-padding bg-paper">
      <div className="container-wide">
        <SectionEyebrow>From insight to action</SectionEyebrow>
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          Intelligence Is Useful. Action Is What Changes the Revenue System.
        </h2>
        <p className="mt-6 text-lg text-warm-600 text-center max-w-2xl mx-auto leading-relaxed">
          Seller Unblocked uses an AI action layer to connect what sellers are experiencing — and what systems show —
          with the next best move for the people who can act on it. Leaders get clearer priorities. Sellers get private,
          practical guidance for the work in front of them.
        </p>

        <div className="mt-16" role="img" aria-label="Seller signals and system evidence flow through Seller Unblocked intelligence to an AI action layer, which branches into leadership action and seller help.">
          {/* Desktop: horizontal flow */}
          <div className="hidden lg:block">
            <div className="flex items-stretch justify-center gap-3">
              {FLOW_STAGES.map((stage, i) => {
                const Icon = STAGE_ICONS[stage.icon]
                return (
                  <div key={stage.label} className="flex items-center gap-3">
                    <div className="rounded-2xl border border-warm-400/25 bg-cream/50 p-6 w-[220px] h-full">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent-dark">
                        <Icon className="h-4 w-4" aria-hidden />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-ink">{stage.label}</p>
                      <p className="mt-2 text-xs text-warm-600 leading-relaxed">{stage.body}</p>
                    </div>
                    {i < FLOW_STAGES.length - 1 && (
                      <span className="text-warm-400 text-xl shrink-0" aria-hidden>
                        →
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="relative mt-6 flex justify-center">
              <div className="flex gap-16">
                <div className="w-px h-8 bg-accent/40" aria-hidden />
                <div className="w-px h-8 bg-violet-400/40" aria-hidden />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-8 max-w-3xl mx-auto">
              <BranchCard
                branch={LEADERSHIP_BRANCH}
                accent="accent"
                pathwayLabel="Leadership action pathway"
              />
              <BranchCard
                branch={SELLER_BRANCH}
                accent="violet"
                pathwayLabel="Seller help pathway"
              />
            </div>
          </div>

          {/* Mobile: vertical stack */}
          <div className="lg:hidden space-y-4">
            {FLOW_STAGES.map((stage, i) => {
              const Icon = STAGE_ICONS[stage.icon]
              return (
                <div key={stage.label}>
                  <div className="rounded-2xl border border-warm-400/25 bg-cream/50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-dark">
                        <Icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{stage.label}</p>
                        <p className="mt-1 text-xs text-warm-600 leading-relaxed">{stage.body}</p>
                      </div>
                    </div>
                  </div>
                  {i < FLOW_STAGES.length - 1 && (
                    <div className="flex justify-center py-2 text-warm-400" aria-hidden>
                      ↓
                    </div>
                  )}
                </div>
              )
            })}
            <div className="border-t border-warm-400/25 pt-6 mt-6 space-y-4">
              <BranchCard branch={LEADERSHIP_BRANCH} accent="accent" pathwayLabel="Leadership action pathway" />
              <BranchCard branch={SELLER_BRANCH} accent="violet" pathwayLabel="Seller help pathway" />
            </div>
          </div>
        </div>

        <blockquote className="mt-14 max-w-2xl mx-auto text-center">
          <p className="text-lg text-ink font-medium leading-relaxed">
            The goal is not to automate judgment. It is to reduce the distance between a seller raising a problem and
            getting meaningful help.
          </p>
        </blockquote>
      </div>
    </section>
  )
}

function BranchCard({
  branch,
  accent,
  pathwayLabel,
}: {
  branch: typeof LEADERSHIP_BRANCH
  accent: 'accent' | 'violet'
  pathwayLabel: string
}) {
  const borderClass = accent === 'accent' ? 'border-accent/30 hover:border-accent/50' : 'border-violet-300/40 hover:border-violet-400/60'
  const labelClass = accent === 'accent' ? 'text-accent-dark' : 'text-violet-700'
  const chipClass = accent === 'accent' ? 'bg-accent/10 text-accent-dark' : 'bg-violet-100 text-violet-800'

  return (
    <article
      className={`group rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${borderClass}`}
      aria-label={pathwayLabel}
    >
      <p className={`text-[0.625rem] font-bold uppercase tracking-wider ${labelClass}`}>{branch.label}</p>
      <h3 className="mt-2 text-base font-semibold text-ink">{branch.headline}</h3>
      <p className="mt-3 text-sm text-warm-600 leading-relaxed">{branch.body}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {branch.examples.map((ex) => (
          <li key={ex} className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-medium ${chipClass}`}>
            {ex}
          </li>
        ))}
      </ul>
    </article>
  )
}
