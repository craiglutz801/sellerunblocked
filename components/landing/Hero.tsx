import BookDemoButton from '@/components/landing/ui/BookDemoButton'
import UnblockedAIHeroDemo from '@/components/landing/UnblockedAIHeroDemo'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-su-ink text-white">
      <div className="landing-grid-dark pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      <div className="landing-hero-container relative px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-10 lg:pb-16 lg:pt-[6.75rem]">
        <div className="mx-auto max-w-[68rem] text-center">
          <p className="landing-eyebrow landing-eyebrow-dark">AI revenue friction intelligence</p>
          <h1 className="mx-auto mt-4 max-w-[18ch] text-[clamp(2.5rem,4.5vw,3.65rem)] font-semibold leading-[1.02] tracking-[-0.046em] text-white [text-wrap:balance] sm:max-w-none">
            Find what’s blocking revenue. Fix what matters first.
          </h1>
          <p className="landing-body-lg mx-auto mt-5 max-w-[40rem] text-white/80">
            SellerUnblocked uses <strong className="font-semibold text-white">UnblockedAI</strong> to continuously listen
            to your sales organization, uncover the hidden friction slowing sellers down, and tell revenue leaders what
            to fix first.
          </p>
          <p className="mx-auto mt-4 max-w-[40rem] text-base leading-relaxed text-white/60 sm:text-[17px]">
            From broken processes and product gaps to missing marketing content, pricing friction, poor handoffs,
            partnership needs, and enablement gaps — turn seller signals into prioritized action.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <BookDemoButton tone="dark" className="w-full sm:w-auto">
              Book a demo
            </BookDemoButton>
            <a
              href="#ask-unblocked-ai"
              className="landing-focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              See UnblockedAI in action
            </a>
          </div>
          <p className="mt-5 text-sm text-white/55">
            Built for CROs, RevOps, Sales Operations, Enablement, and GTM leaders.
          </p>
        </div>
        <div className="mt-8 sm:mt-10">
          <UnblockedAIHeroDemo />
        </div>
      </div>
    </section>
  )
}
