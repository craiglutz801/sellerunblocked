'use client'

import { useRef, useState } from 'react'
import type { AskBody } from '@/lib/unblocked-ai/types'
import type { ReadoutModel } from '@/lib/unblocked-ai/readout'
import { useUnblockedAi } from '@/components/app/unblocked-ai/assistant'

export default function ReadoutView({ model }: { model: ReadoutModel }) {
  const ai = useUnblockedAi()
  const [question, setQuestion] = useState('')
  const [analysis, setAnalysis] = useState<AskBody | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const first = model.priorities[0]
  const rest = model.priorities.slice(1)

  function submitQuestion() {
    const value = question.trim()
    if (!value) return
    ai.open({ question: value, surface: 'unblocked_ai' })
    setQuestion('')
  }

  async function analyze() {
    if (!model.revisionId) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setAnalyzing(true)
    setAnalyzeError('')
    try {
      const response = await fetch('/api/unblocked-ai/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          requestId: `analyze-${Date.now()}`,
          scope: { workspaceSlug: model.workspaceSlug, revisionId: model.revisionId },
        }),
      })
      const body = (await response.json()) as AskBody
      if (body.scope && body.scope.workspaceSlug !== model.workspaceSlug) return
      if (body.kind === 'stale_context') {
        setAnalyzeError(body.message || "You're viewing a new wave. Ask again to use its results.")
        return
      }
      setAnalysis(body)
      if (body.source !== 'unblocked_ai') setAnalyzeError(body.message || '')
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      setAnalyzeError('AI analysis is temporarily unavailable.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
      <section className="app-card p-6 md:p-8 lg:col-span-2 lg:col-start-1 lg:row-start-1">
        <p className="app-eyebrow">Main finding</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-ink [text-wrap:balance]">{model.finding}</p>
        {model.chips.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {model.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-accent/30 bg-accent-soft/70 px-3 py-1 text-xs font-semibold tabular-nums text-ink">
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-accent-dark px-4 py-2 text-sm font-semibold text-white hover:bg-ink"
            onClick={() =>
              ai.open({
                mode: 'evidence',
                evidence: model.evidence,
                rule: model.rule,
                surface: 'unblocked_ai',
              })
            }
          >
            View evidence
          </button>
          {model.priorities[0]?.draft ? (
            <button
              type="button"
              className="rounded-full border border-accent/40 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-accent/10"
              onClick={() =>
                ai.open({
                  mode: 'draft',
                  draft: model.priorities[0].draft,
                  evidence: model.priorities[0].evidence,
                  surface: 'unblocked_ai',
                  pillarKey: model.priorities[0].pillarKey,
                })
              }
            >
              Draft an action
            </button>
          ) : null}
          <button type="button" className="text-sm font-semibold text-accent-dark hover:text-ink" onClick={() => void analyze()} disabled={analyzing}>
            {analyzing ? 'Reviewing this wave…' : 'Analyze wave'}
          </button>
          {analyzing ? (
            <button type="button" className="text-sm font-semibold text-warm-600 hover:text-ink" onClick={() => abortRef.current?.abort()}>
              Cancel
            </button>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-warm-500">
          {analysis?.source === 'unblocked_ai' ? 'UnblockedAI' : model.sourceLabel}
          {model.isDemo ? ' · DemoTech · Demo data' : ''} · {model.organizationName} · {model.period}
          {analysis?.analysisAt ? ` · ${new Date(analysis.analysisAt).toLocaleString()}` : ''}
        </p>
        {analyzeError ? <p className="mt-2 text-sm text-warm-600">{analyzeError}</p> : null}
        {analysis?.content?.interpretation && analysis.source === 'unblocked_ai' ? (
          <p className="mt-3 text-sm leading-relaxed text-ink">{analysis.content.interpretation.hypothesis}</p>
        ) : null}
      </section>

      {first ? <PriorityCard row={first} className="lg:col-span-2 lg:col-start-1 lg:row-start-2" /> : null}

      <section className="app-card p-5 lg:col-start-3 lg:row-start-1">
        <p className="app-eyebrow">Ask</p>
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault()
            submitQuestion()
          }}
        >
          <label htmlFor="wave-question" className="sr-only">
            Ask about this wave
          </label>
          <textarea
            id="wave-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            placeholder="Ask about this wave…"
            className="w-full resize-y rounded-xl border border-warm-400/40 bg-white px-3 py-2 text-sm text-ink"
          />
          <button type="submit" className="mt-3 rounded-full bg-accent-dark px-4 py-2 text-sm font-semibold text-white hover:bg-ink">
            Send
          </button>
        </form>
        <ul className="mt-4 space-y-2">
          {model.prompts.map((prompt) => (
            <li key={prompt.id}>
              <button
                type="button"
                disabled={!prompt.available}
                onClick={() => ai.open({ question: prompt.question, intent: prompt.intent, surface: 'unblocked_ai' })}
                className="text-left text-sm font-semibold text-accent-dark hover:text-ink disabled:cursor-not-allowed disabled:text-warm-400"
              >
                {prompt.label}
              </button>
              {!prompt.available && prompt.reason ? <p className="text-xs text-warm-500">{prompt.reason}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      {rest.length ? (
        <div className="space-y-4 lg:col-span-2 lg:col-start-1 lg:row-start-3">
          {rest.map((row) => (
            <PriorityCard key={row.pillarKey} row={row} />
          ))}
        </div>
      ) : null}

      <section className="app-card p-5 lg:col-start-3 lg:row-start-2">
        <p className="app-eyebrow">Coverage and measurement</p>
        <dl className="mt-4 space-y-4">
          {model.coverage.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-warm-500">{item.label}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-warm-700">{item.body}</dd>
            </div>
          ))}
        </dl>
        {model.gaps.length ? (
          <ul className="mt-4 space-y-2 text-sm text-warm-600">
            {model.gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-4 text-xs leading-relaxed text-warm-500">{model.rule}</p>
      </section>
    </div>
  )
}

function PriorityCard({ row, className = '' }: { row: ReadoutModel['priorities'][number]; className?: string }) {
  const ai = useUnblockedAi()
  return (
    <article className={`app-card p-5 ${className}`}>
      <h2 className="text-lg font-semibold text-ink">{row.issue}</h2>
      <p className="mt-2 text-sm tabular-nums text-warm-700">{row.metric}</p>
      {row.explanation ? <p className="mt-3 text-sm leading-relaxed text-warm-600">{row.explanation}</p> : null}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-warm-500">Suggested owner · {row.owner}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <button
          type="button"
          className="text-sm font-semibold text-accent-dark hover:text-ink"
          onClick={() => ai.open({ mode: 'evidence', evidence: row.evidence, rule: 'Priorities from this wave use the lowest pillar indexes with at least 5 valid ratings.', surface: 'unblocked_ai', pillarKey: row.pillarKey })}
        >
          View evidence
        </button>
        <button
          type="button"
          className="text-sm font-semibold text-accent-dark hover:text-ink"
          onClick={() => ai.open({ mode: 'draft', draft: row.draft, evidence: row.evidence, surface: 'unblocked_ai', pillarKey: row.pillarKey })}
        >
          Draft an action
        </button>
      </div>
    </article>
  )
}
