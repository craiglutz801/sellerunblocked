import SectionIntro from '@/components/landing/ui/SectionIntro'
import { DEMO_PRIORITIES, OWNERS, PIPELINE } from '@/lib/landing/demo-data'

export default function SignalToAction() {
  const brief = DEMO_PRIORITIES[1]
  return (
    <section className="landing-section bg-su-ink2 text-white">
      <div className="landing-container">
        <SectionIntro tone="dark" title="A seller raises a problem. The right team gets the intelligence to fix it.">
          <span className="text-white/70">
            The value is not merely detecting a complaint. It is reducing the distance between a signal and the team
            that can remove the friction.
          </span>
        </SectionIntro>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {PIPELINE.map((step, index) => (
            <li key={step} className="landing-card-dark px-4 py-4">
              <span className="landing-mono text-su-blueBright">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-3 text-sm font-medium leading-snug">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Teams that can receive a brief">
          {OWNERS.map((owner) => (
            <span key={owner} className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/80">
              {owner}
            </span>
          ))}
        </div>

        <article className="mt-10 grid gap-8 rounded-[28px] border border-white/10 bg-su-ink p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="landing-h3">Example action brief</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Same healthcare issue as the priority list. The brief is the handoff, not another chart.
            </p>
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <Item label="Issue" value={brief.shortTitle} />
            <Item label="Why it matters" value={`Appears in ${brief.signalCount} Enterprise proposal-stage signals`} />
            <Item label="Root cause" value={brief.diagnosis} />
            <Item label="Suggested owner" value={brief.owner} />
            <Item label="Recommended action" value={brief.recommendation} />
            <Item label="Measure next" value="Proposal-stage confidence and issue prevalence after release" />
          </dl>
        </article>
      </div>
    </section>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-white/45">{label}</dt>
      <dd className="mt-2 leading-relaxed text-white">{value}</dd>
    </div>
  )
}
