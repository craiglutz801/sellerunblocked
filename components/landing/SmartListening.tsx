'use client'

import { useState } from 'react'
import SectionIntro from '@/components/landing/ui/SectionIntro'
import UnblockedMark from '@/components/landing/ui/UnblockedMark'
import { LISTENING_FOLLOWUPS, LISTENING_OPTIONS } from '@/lib/landing/demo-data'

export default function SmartListening() {
  const [choice, setChoice] = useState<(typeof LISTENING_OPTIONS)[number]['id']>('unknown')
  const selected = LISTENING_OPTIONS.find((item) => item.id === choice) ?? LISTENING_OPTIONS[0]

  return (
    <section id="how-it-works" className="landing-section bg-su-paper">
      <div className="landing-container grid items-start gap-12 lg:grid-cols-2">
        <SectionIntro title="Static surveys stop at the answer. UnblockedAI asks why.">
          SellerUnblocked can use context-aware follow-ups to turn a vague complaint into a diagnosable operating issue
          without forcing sellers through a long questionnaire.
        </SectionIntro>
        <div className="landing-product-frame-light p-5 sm:p-7">
          <div className="space-y-5">
            <Bubble label="Question" body="What made selling harder than it should have been this month?" />
            <Bubble label="Seller" body="Pricing approvals take forever." />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-su-blueText">
                <UnblockedMark /> follow-up
              </p>
              <p className="mt-2 text-sm text-su-text">Which part creates the most friction?</p>
              <div className="mt-3 grid gap-2" role="radiogroup" aria-label="Follow-up choices">
                {LISTENING_OPTIONS.map((option) => {
                  const on = option.id === choice
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setChoice(option.id)}
                      className={`landing-focus-ring min-h-11 rounded-xl border px-3 text-left text-sm ${
                        on ? 'border-su-blue bg-su-blueSoft text-su-text' : 'border-su-text/10 text-su-secondary hover:border-su-text/25'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <Bubble
              label="UnblockedAI follow-up"
              body={LISTENING_FOLLOWUPS[selected.id]}
              note={`Seller chose: ${selected.label}`}
            />
          </div>
          <p className="mt-6 border-t border-su-text/10 pt-4 text-sm leading-relaxed text-su-secondary">
            Follow-ups should be concise, relevant, and limited. The goal is better signal, not an endless AI interview.
          </p>
        </div>
      </div>
    </section>
  )
}

function Bubble({ label, body, note }: { label: string; body: string; note?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-su-muted">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-su-text">{body}</p>
      {note ? <p className="mt-1 text-xs text-su-muted">{note}</p> : null}
    </div>
  )
}
