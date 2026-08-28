import SectionEyebrow from '@/components/SectionEyebrow'
import { KIT_MODULES } from '@/lib/landing/content'

const FOCUS_AREAS = [
  { label: 'Deal Support', gap: '−6 vs org average' },
  { label: 'Commercial Confidence', gap: '−9 vs org average' },
  { label: 'Proposal Stage', gap: 'Needs support' },
]

const TYPE_COLORS: Record<string, string> = {
  Playbook: 'bg-sky-100 text-sky-800',
  Template: 'bg-emerald-100 text-emerald-800',
  Drill: 'bg-violet-100 text-violet-800',
  Checklist: 'bg-amber-100 text-amber-900',
}

export default function EnablementKits() {
  return (
    <section id="enablement-kits" className="section-padding bg-ink text-white overflow-hidden">
      <div className="container-wide">
        <SectionEyebrow>
          <span className="text-accent-light">IC enablement kits</span>
        </SectionEyebrow>
        <h2 className="text-section font-bold text-center max-w-3xl mx-auto">
          Turn Seller Feedback Into Personalized Enablement Kits
        </h2>
        <p className="mt-6 text-lg text-warm-400 text-center max-w-2xl mx-auto leading-relaxed">
          Every seller gets a private, AI-curated kit built from their own responses — helping them move from feedback
          to action immediately.
        </p>
        <p className="mt-8 text-center text-xl font-semibold text-accent-light">
          Your feedback stays private. Your help is personal.
        </p>

        <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-6 text-warm-400 leading-relaxed">
            <p>
              SellerUnblocked extends beyond executive dashboards with a private seller center. After each measurement cycle,
              reps receive a tailored enablement kit based on their scores, stage confidence, open-text feedback, and
              role context.
            </p>
            <p>
              The experience is supportive, not punitive. It validates what the seller is experiencing, identifies a few
              focus areas, and recommends practical modules they can use right away.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Built from the seller’s own feedback',
                'Highlights 2–3 focus areas',
                'Recommends 3–5 practical modules',
                'Uses approved enablement content first',
                'Includes optional manager-share prompts',
                'Keeps leadership reporting aggregated and anonymous',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-light" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-light/90 p-6 md:p-8 shadow-2xl ring-1 ring-accent/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Your Enablement Kit</h3>
                <p className="text-xs text-accent-light mt-1">Private to you</p>
              </div>
              <span className="rounded-full bg-accent/20 px-2.5 py-1 text-[0.625rem] font-bold uppercase text-accent-light">
                Q2 pulse
              </span>
            </div>

            <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-warm-500">Acknowledgment</p>
              <p className="mt-2 text-sm text-white/85 leading-relaxed">
                &ldquo;You flagged inconsistent deal desk guidance. That creates real friction. This kit is designed to
                help you navigate it while leadership works on the broader process.&rdquo;
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-warm-500 mb-3">Focus areas</p>
              <ul className="space-y-2">
                {FOCUS_AREAS.map((f) => (
                  <li key={f.label} className="flex justify-between gap-4 text-sm">
                    <span className="text-white font-medium">{f.label}</span>
                    <span className="text-warm-400 tabular-nums shrink-0">{f.gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-warm-500 mb-3">Recommended modules</p>
              {KIT_MODULES.map((m) => (
                <div key={m.title} className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase ${TYPE_COLORS[m.type] ?? 'bg-warm-400/20 text-white/85'}`}>
                    {m.type}
                  </span>
                  <span className="text-sm text-white font-medium flex-1 min-w-[140px]">{m.title}</span>
                  <span className="text-xs text-warm-500 tabular-nums">{m.duration}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-accent/30 bg-accent/5 p-4">
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-accent-light">Optional manager prompt</p>
              <p className="mt-2 text-xs text-warm-400 italic leading-relaxed">
                &ldquo;I&apos;d like 15 minutes to pressure-test pricing strategy on my next enterprise
                opportunity.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
