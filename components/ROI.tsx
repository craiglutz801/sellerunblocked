import { ROI_LEVERS } from '@/lib/landing/content'

export default function ROI() {
  return (
    <section id="roi" className="section-padding bg-paper">
      <div className="container-wide">
        <h2 className="text-section font-bold text-ink text-center max-w-2xl mx-auto">
          A Small Investment Compared to the Cost of Sales Inefficiency
        </h2>
        <div className="mt-10 max-w-2xl mx-auto space-y-5 text-warm-600 text-lg text-center leading-relaxed">
          <p>
            For many organizations, replacing a single seller can cost $75K to $250K or more when you account for
            recruiting, ramp time, lost productivity, and missed revenue.
          </p>
          <p>
            SellerUnblocked also improves the ROI of your existing enablement investment. Most companies already have
            playbooks, templates, checklists, and training materials. The issue is not always content
            creation — it is matching the right resource to the right seller at the right moment.
          </p>
          <p className="font-medium text-ink">
            IC Enablement Kits turn existing enablement assets into targeted seller support.
          </p>
        </div>
        <div className="mt-12 max-w-xs mx-auto rounded-2xl bg-ink text-white p-10 text-center">
          <p className="text-3xl font-bold tracking-tight">$75K – $250K+</p>
          <p className="mt-3 text-sm text-warm-400">Typical cost to replace one seller</p>
        </div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROI_LEVERS.map((lever) => (
            <div key={lever.title} className="rounded-2xl border border-warm-400/20 bg-cream/50 p-6">
              <h3 className="font-semibold text-ink">{lever.title}</h3>
              <p className="mt-2 text-sm text-warm-600 leading-relaxed">{lever.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
