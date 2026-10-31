'use client'

import { useRef, useState } from 'react'
import DemoLabel from '@/components/landing/ui/DemoLabel'
import SectionIntro from '@/components/landing/ui/SectionIntro'
import UnblockedMark from '@/components/landing/ui/UnblockedMark'
import { ASK_ANSWER_IDS, answerById } from '@/lib/landing/demo-data'

export default function AskUnblockedAI() {
  const [current, setCurrent] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [evidence, setEvidence] = useState(false)
  const [brief, setBrief] = useState(false)
  const revealed = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answer = current ? answerById(current) : null

  function ask(id: string) {
    if (timer.current) clearTimeout(timer.current)
    setEvidence(false)
    setBrief(false)
    if (!revealed.current) {
      setPending(true)
      setCurrent(id)
      timer.current = setTimeout(() => {
        setPending(false)
        revealed.current = true
      }, 380)
      return
    }
    setPending(false)
    setCurrent(id)
  }

  return (
    <section id="ask-unblocked-ai" className="landing-section bg-su-blueSoft/40">
      <div className="landing-container">
        <SectionIntro title="Ask your sales organization a question. Get an evidence-backed answer.">
          No pivot tables. No combing through open text. Ask UnblockedAI what is changing, who is affected, why it
          matters, and what to do next.
        </SectionIntro>

        <div className="landing-product-frame-light mt-12 grid gap-0 overflow-hidden lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.3fr)]">
          <div className="border-b border-su-text/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-su-text">
                Ask <UnblockedMark />
              </p>
              <DemoLabel />
            </div>
            <div className="mt-4 grid gap-2" role="group" aria-label="Suggested questions">
              {ASK_ANSWER_IDS.map((id) => {
                const item = answerById(id)
                const on = id === current
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => ask(id)}
                    className={`landing-focus-ring min-h-11 rounded-2xl border px-3 py-2 text-left text-sm leading-snug motion-safe:transition-colors ${
                      on ? 'border-su-blue bg-su-blueSoft text-su-text' : 'border-su-text/10 bg-white text-su-secondary hover:border-su-text/25 hover:text-su-text'
                    }`}
                  >
                    {item.question}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="min-h-[22rem] p-5 sm:p-8" aria-live="polite">
            {!answer ? (
              <div>
                <p className="landing-mono text-su-muted">Waiting for a question</p>
                <p className="mt-4 max-w-md text-lg leading-snug text-su-text">
                  Choose a question. The answer comes from the same illustrative workspace as the priority list.
                </p>
              </div>
            ) : pending ? (
              <p className="text-sm text-su-secondary">Analyzing seller signals…</p>
            ) : (
              <div>
                <p className="text-lg font-medium leading-relaxed tracking-tight text-su-text sm:text-xl">{answer.lead}</p>
                <dl className="mt-6 grid gap-4 border-t border-su-text/10 pt-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-su-muted">Evidence</dt>
                    <dd className="landing-nums mt-1 text-sm font-medium text-su-text">{answer.evidenceCount} signals</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-su-muted">Affected</dt>
                    <dd className="mt-1 text-sm font-medium text-su-text">{answer.segments.join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-su-muted">Trend</dt>
                    <dd className="mt-1 text-sm font-medium text-su-text">{answer.trend}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm leading-relaxed text-su-text">
                  <span className="text-su-muted">Next. </span>
                  {answer.nextStep}
                </p>
                <p className="mt-2 text-sm text-su-secondary">Recommended owner: {answer.owner}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-expanded={evidence}
                    onClick={() => setEvidence((value) => !value)}
                    className="landing-focus-ring min-h-11 rounded-full border border-su-text/15 px-4 text-sm font-medium text-su-text hover:bg-su-paper"
                  >
                    {evidence ? 'Hide evidence' : 'Show evidence'}
                  </button>
                  <button
                    type="button"
                    aria-pressed={brief}
                    onClick={() => setBrief(true)}
                    className="landing-focus-ring min-h-11 rounded-full bg-su-ink px-4 text-sm font-semibold text-white hover:bg-su-ink2"
                  >
                    Create brief
                  </button>
                </div>
                {evidence ? (
                  <ul className="mt-4 space-y-2">
                    {answer.snippets.map((snippet) => (
                      <li key={snippet} className="text-sm leading-relaxed text-su-secondary">
                        “{snippet}”
                      </li>
                    ))}
                  </ul>
                ) : null}
                {brief ? (
                  <p className="mt-4 text-sm text-su-blueText">
                    Sample brief drafted for {answer.owner}. This demo does not save or send it.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
