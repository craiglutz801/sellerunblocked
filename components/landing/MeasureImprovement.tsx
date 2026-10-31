'use client'

import { useEffect, useRef, useState } from 'react'
import DemoLabel from '@/components/landing/ui/DemoLabel'
import SectionIntro from '@/components/landing/ui/SectionIntro'
import { MEASURE_SEGMENTS, MEASURE_SERIES } from '@/lib/landing/demo-data'

export default function MeasureImprovement() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(true)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="landing-section bg-su-paper">
      <div className="landing-container">
        <SectionIntro title="Know whether the fix actually worked.">
          SellerUnblocked tracks the same friction over time so leadership can see whether interventions reduced drag,
          shifted seller confidence, or simply moved the problem somewhere else. Comparison here is internal and
          historical. External benchmarks are not shown until a validated dataset exists.
        </SectionIntro>
        <div ref={ref} className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="landing-product-frame-light p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-su-text">Pricing approval friction</h3>
              <DemoLabel />
            </div>
            <p className="mt-2 text-sm text-su-secondary">Share of enterprise sellers mentioning the issue. Illustrative.</p>
            <div className="mt-8 grid grid-cols-3 gap-4" role="img" aria-label="Illustrative trend: 31 percent, then 19 percent after a new approval path, then 12 percent.">
              {MEASURE_SERIES.map((point) => (
                <div key={point.label}>
                  <div className="flex h-40 items-end rounded-2xl bg-su-paper px-3">
                    <div
                      className="w-full rounded-t-lg bg-su-ink motion-safe:transition-[height] motion-safe:duration-700"
                      style={{ height: shown ? `${point.value * 2.6}%` : '0%' }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-su-secondary">{point.label}</p>
                  <p className="landing-nums text-lg font-semibold text-su-text">{point.value}%</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-su-secondary">
              Between cycle 1 and cycle 2, the illustrative intervention is a new approval path.
            </p>
            <ul className="sr-only">
              {MEASURE_SERIES.map((point) => (
                <li key={point.label}>
                  {point.label}: {point.value} percent. {point.detail}
                </li>
              ))}
            </ul>
          </article>
          <article className="landing-card p-6 sm:p-8">
            <h3 className="text-base font-semibold text-su-text">Internal segment comparison</h3>
            <p className="mt-2 text-sm leading-relaxed text-su-secondary">
              Same issue, cycle 1 to cycle 3. The movement is concentrated in enterprise, which is where the intervention was aimed.
            </p>
            <ul className="mt-6 space-y-4">
              {MEASURE_SEGMENTS.map((segment) => (
                <li key={segment.label} className="border-t border-su-text/10 pt-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-su-text">{segment.label}</span>
                    <span className="landing-nums text-sm text-su-secondary">
                      {segment.before}% → {segment.after}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
