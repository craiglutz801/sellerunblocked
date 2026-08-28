import SectionEyebrow from '@/components/SectionEyebrow'
import { SELLER_COACH_USE_CASES } from '@/lib/landing/agentic'
import { MessageSquare, Search, Target, Zap } from 'lucide-react'

const USE_CASE_ICONS = [Target, Search, MessageSquare, Zap]

const RESOURCE_CHIPS = [
  'Pricing exception packet · 15 min',
  'Customer-reference brief · 10 min',
  'Handoff checklist · 8 min',
]

export default function SellerCoachSection() {
  return (
    <section id="seller-coach" className="section-padding bg-ink text-white border-t border-white/5">
      <div className="container-wide">
        <SectionEyebrow>
          <span className="text-accent-light">Private seller support</span>
        </SectionEyebrow>
        <h2 className="text-section font-bold text-center max-w-3xl mx-auto">
          A Seller Coach That Helps With the Work in Front of You.
        </h2>
        <p className="mt-6 text-lg text-warm-400 text-center max-w-2xl mx-auto leading-relaxed">
          A kit should not feel like a list of assignments. SellerUnblocked can give each rep a private AI guide that
          understands their focus areas, role context, approved company resources, and the sales moments where they need
          confidence most.
        </p>

        <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <SellerCoachMockup />
          <div className="grid sm:grid-cols-2 gap-4">
            {SELLER_COACH_USE_CASES.map((uc, i) => {
              const Icon = USE_CASE_ICONS[i]
              return (
                <div
                  key={uc.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-violet-400/30 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{uc.title}</h3>
                  <p className="mt-2 text-sm text-warm-400 leading-relaxed">{uc.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto rounded-2xl border border-accent/30 bg-accent/5 px-6 py-5 text-center">
          <p className="text-sm font-semibold text-accent-light">Private by design</p>
          <p className="mt-2 text-sm text-warm-400 leading-relaxed">
            Your seller coach supports you. It does not create a manager scorecard, expose your kit, or turn your
            responses into individual performance reporting.
          </p>
        </div>
      </div>
    </section>
  )
}

function SellerCoachMockup() {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-ink-light/90 shadow-2xl ring-1 ring-violet-500/20 overflow-hidden"
      role="img"
      aria-label="Illustrative private seller coach conversation helping prepare for an executive buyer conversation."
    >
      <div className="border-b border-white/10 bg-white/5 px-5 py-4">
        <p className="text-sm font-semibold text-white">Your private seller coach</p>
        <p className="text-xs text-warm-400 mt-0.5">Built from your focus areas and approved resources</p>
      </div>
      <div className="p-5 space-y-4">
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 ml-4">
          <p className="text-xs text-warm-500 mb-1">You</p>
          <p className="text-sm text-white/90 leading-relaxed">
            I have an executive buyer call tomorrow. I need a sharper commercial story and I expect pricing pushback.
          </p>
        </div>
        <div className="rounded-xl bg-violet-500/10 border border-violet-400/20 px-4 py-3 mr-2">
          <p className="text-xs text-violet-300 mb-1">Seller coach</p>
          <p className="text-sm text-white/90 leading-relaxed">
            You flagged pricing confidence as a focus area. Here is a 12-minute prep plan for tomorrow:
          </p>
          <ol className="mt-3 space-y-1.5 text-sm text-warm-300 list-decimal list-inside">
            <li>Use the customer-reference brief</li>
            <li>Lead with these three discovery questions</li>
            <li>Practice the pricing objection drill</li>
            <li>Bring in deal desk early if commercial terms change</li>
          </ol>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {RESOURCE_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.6875rem] text-warm-300"
            >
              {chip}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          tabIndex={-1}
          aria-hidden
        >
          Start prep plan →
        </button>
      </div>
    </div>
  )
}
