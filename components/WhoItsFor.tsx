import { ROLE_CARDS } from '@/lib/landing/content'

export default function WhoItsFor() {
  return (
    <section id="who-its-for" className="section-padding bg-cream">
      <div className="container-wide">
        <h2 className="text-section font-bold text-ink text-center max-w-2xl mx-auto">
          Built for Complex Revenue Organizations
        </h2>
        <p className="mt-10 text-warm-600 text-lg max-w-xl mx-auto text-center leading-relaxed">
          Seller Unblocked is designed for companies where operational complexity creates distance between leadership and
          the day-to-day reality of sellers — complex deals, multiple approvers, and specialists in the motion.
        </p>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROLE_CARDS.map((card) => (
            <div
              key={card.role}
              className="rounded-2xl bg-paper border border-warm-400/20 p-6 hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-ink">{card.role}</h3>
              <p className="mt-2 text-sm text-warm-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-warm-600 font-medium text-center">
          Best fit for organizations with <span className="text-ink">100+ sellers</span>.
        </p>
      </div>
    </section>
  )
}
