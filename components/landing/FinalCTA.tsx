import BookDemoButton from '@/components/landing/ui/BookDemoButton'

export default function FinalCTA() {
  return (
    <section className="landing-section bg-su-ink text-white">
      <div className="landing-container">
        <div className="mx-auto max-w-[46rem] text-center">
          <p className="landing-eyebrow landing-eyebrow-dark">See what your sales organization is trying to tell you</p>
          <h2 className="landing-h2 mt-5">Find the friction your dashboards and call recordings don’t surface.</h2>
          <p className="landing-body-lg mx-auto mt-6 text-white/70">
            See how SellerUnblocked and UnblockedAI can turn seller experience into prioritized, evidence-backed action
            across RevOps, Product, Marketing, Enablement, Partnerships, and Sales leadership.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <BookDemoButton tone="dark" className="w-full sm:w-auto">
              Book a demo
            </BookDemoButton>
            <a
              href="#unblocked-ai"
              className="landing-focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              Explore UnblockedAI
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
