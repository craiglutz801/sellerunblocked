import SectionEyebrow from '@/components/SectionEyebrow'
import {
  UNBLOCKING_CAPABILITY_GROUPS,
  UNBLOCKING_EVIDENCE,
  UNBLOCKING_INTEGRATIONS,
  UNBLOCKING_INTEGRATIONS_NOTE,
  UNBLOCKING_JOBS,
  UNBLOCKING_OUTCOMES,
  UNBLOCKING_TARGETED_QUESTION,
} from '@/lib/landing/agentic'

export default function UnblockingInPractice() {
  return (
    <section id="unblocking" className="section-padding bg-cream">
      <div className="container-wide">
        <SectionEyebrow>Unblocking in practice</SectionEyebrow>
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          Find What Blocks Selling. Fix What AI Can. Show Leadership the Rest.
        </h2>
        <p className="mt-6 text-lg text-warm-600 text-center max-w-2xl mx-auto leading-relaxed">
          Seller insight stays the human signal. Permitted system evidence makes it undeniable. Seller Unblocked asks
          one precise question only when the systems cannot explain the stall.
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {UNBLOCKING_JOBS.map((job, i) => (
            <article
              key={job.title}
              className="rounded-2xl border border-warm-400/25 bg-paper p-6 md:p-7"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent-dark text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{job.title}</h3>
              <p className="mt-2 text-sm text-warm-600 leading-relaxed">{job.body}</p>
            </article>
          ))}
        </div>

        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {UNBLOCKING_INTEGRATIONS.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-warm-400/20 bg-paper/80 px-4 py-3"
            >
              <p className="text-sm font-semibold text-ink">{item.name}</p>
              <p className="mt-1 text-xs text-warm-600 leading-relaxed">{item.use}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-warm-500 max-w-xl mx-auto leading-relaxed">
          {UNBLOCKING_INTEGRATIONS_NOTE}
        </p>

        <div className="mt-16 rounded-3xl border border-warm-400/25 bg-paper p-6 md:p-10 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-accent-dark">
            Friction Detective · Northbridge Industrial
          </p>
          <h3 className="mt-3 text-xl md:text-2xl font-semibold text-ink max-w-2xl">
            Enterprise deals are losing eight days in discount approval — and it is not a seller skill gap.
          </h3>
          <p className="mt-3 text-sm text-warm-600 max-w-2xl leading-relaxed">
            One seller comment is a clue. Four systems plus one targeted question is a diagnosis.
          </p>

          <ol className="mt-8 grid sm:grid-cols-2 gap-4">
            {UNBLOCKING_EVIDENCE.map((item, i) => (
              <li
                key={item.source}
                className="rounded-2xl border border-warm-400/20 bg-cream/50 p-5"
              >
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-warm-500">
                  {i + 1}. {item.source}
                </p>
                <p className="mt-2 text-sm text-ink leading-relaxed">{item.finding}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-2xl border-2 border-accent/35 bg-gradient-to-br from-accent-soft/40 to-paper p-5 md:p-6">
            <p className="text-[0.625rem] font-bold uppercase tracking-wider text-accent-dark">
              Targeted question · asked only when systems cannot settle the cause
            </p>
            <p className="mt-3 text-base md:text-lg font-medium text-ink leading-snug">
              “{UNBLOCKING_TARGETED_QUESTION}”
            </p>
            <p className="mt-2 text-xs text-warm-500">
              Sent to affected enterprise sellers as a cohort. Leadership never sees named answers.
            </p>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {UNBLOCKING_OUTCOMES.map((item) => (
              <div key={item.label} className="rounded-2xl border border-warm-400/20 bg-cream/40 p-5">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-warm-500">{item.label}</p>
                <p className="mt-2 text-sm text-ink leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-500 text-center">
            What the action layer can also do
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UNBLOCKING_CAPABILITY_GROUPS.map((group) => (
              <div key={group.group} className="rounded-2xl border border-warm-400/20 bg-paper px-5 py-4">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-accent-dark">{group.group}</p>
                <ul className="mt-3 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-warm-600 leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-warm-500 max-w-xl mx-auto leading-relaxed">
            Friction Detective, Targeted Question, and Leadership Action are already in the story above. This is the
            rest of the layer — not a second product.
          </p>
        </div>
      </div>
    </section>
  )
}
