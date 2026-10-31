'use client'

import { useState } from 'react'
import { FAQ_ITEMS } from '@/lib/landing/demo-data'

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(FAQ_ITEMS[0].id)

  return (
    <section className="landing-section bg-su-paper">
      <div className="landing-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <h2 className="landing-h2 text-su-text">Questions worth answering before a demo.</h2>
        <div className="border-t border-su-text/10">
          {FAQ_ITEMS.map((item) => {
            const expanded = open === item.id
            const panelId = `faq-${item.id}`
            return (
              <div key={item.id} className="border-b border-su-text/10">
                <h3>
                  <button
                    type="button"
                    className="landing-focus-ring flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-su-text"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : item.id)}
                  >
                    {item.question}
                    <span aria-hidden className="text-su-muted">
                      {expanded ? '–' : '+'}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" hidden={!expanded} className="pb-5 pr-8 text-sm leading-relaxed text-su-secondary">
                  {item.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
