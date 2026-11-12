'use client'

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import type { AssistantFrame, AskBody, DraftAction, EvidenceItem, IntentHint, Surface } from '@/lib/unblocked-ai/types'
import type { PillarKey } from '@/lib/types/platform'

type OpenRequest = {
  question?: string
  intent?: IntentHint
  pillarKey?: PillarKey
  recommendationId?: string
  surface?: Surface
  mode?: 'answer' | 'evidence' | 'draft'
  evidence?: EvidenceItem[]
  draft?: DraftAction
  rule?: string
  launcher?: HTMLElement | null
}

type Turn = { id: string; question: string; body: AskBody | null }

type Controller = {
  frame: AssistantFrame
  open: (input: OpenRequest) => void
  clearNow: () => void
}

const AssistantContext = createContext<Controller | null>(null)

export function useUnblockedAi(): Controller {
  const value = useContext(AssistantContext)
  if (!value) throw new Error('UnblockedAI is available in the leadership app.')
  return value
}

const SURFACE_LABEL: Record<Surface, string> = {
  overview: 'Overview',
  diagnostics: 'Diagnostics',
  insights: 'Insights',
  recommendations: 'Recommendations',
  unblocked_ai: 'UnblockedAI',
  benchmarks: 'Benchmarks',
  responses: 'Responses',
}

function chipLabels(evidence: EvidenceItem[] | undefined, ids: string[] | undefined): string[] {
  if (!evidence || !ids) return []
  const chips: string[] = []
  for (const id of ids) {
    const item = evidence.find((entry) => entry.id === id)
    if (!item || item.kind !== 'metric') continue
    if (item.unit === 'index_0_100') {
      chips.push(`${item.label} ${item.value}/100`)
      if (item.validCount != null) chips.push(`${item.validCount} valid ratings`)
    } else if (item.unit === 'count') chips.push(`${item.value} ${item.label}`)
    else if (item.unit === 'points') chips.push(`${item.value} ${item.label.toLowerCase()}`)
  }
  return chips
}

function copyDraft(draft: DraftAction): string {
  return [
    'Action draft',
    `Title: ${draft.title}`,
    `Prompted by: ${draft.promptedBy}`,
    `Owner function: ${draft.suggestedOwnerFunction}`,
    `First step: ${draft.firstStep}`,
    `Measure: ${draft.measure}`,
    `Baseline: ${draft.baseline}`,
    `Source wave: ${draft.sourceWave}`,
    draft.followUpQuestion ? `Follow-up question (draft): ${draft.followUpQuestion}` : '',
    draft.evidenceIds.length ? `Evidence: ${draft.evidenceIds.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export default function UnblockedAiProvider({ frame, children }: { frame: AssistantFrame; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [mode, setMode] = useState<'answer' | 'evidence' | 'draft'>('answer')
  const [entry, setEntry] = useState<OpenRequest | null>(null)
  const [preparedEvidence, setPreparedEvidence] = useState<EvidenceItem[] | null>(null)
  const [draft, setDraft] = useState<DraftAction | null>(null)
  const [rule, setRule] = useState<string | undefined>()
  const [composer, setComposer] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)
  const generation = useRef(0)
  const launcher = useRef<HTMLElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  function clearNow() {
    generation.current += 1
    abortRef.current?.abort()
    setTurns([])
    setPreparedEvidence(null)
    setDraft(null)
    setEntry(null)
    setRule(undefined)
    setStatus('')
    setPending(false)
    setMode('answer')
  }

  useEffect(() => {
    clearNow()
    // Reset when the selected workspace or published revision changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.workspaceSlug, frame.revisionId])

  function close() {
    setOpen(false)
    const target = launcher.current
    window.setTimeout(() => target?.focus(), 0)
  }

  async function send(input: OpenRequest) {
    if (!frame.published || !frame.revisionId) {
      setOpen(true)
      setStatus('Publish a wave to use UnblockedAI.')
      setMode('answer')
      return
    }
    const question = input.question?.trim()
    if (!question) return
    const requestGeneration = generation.current
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller
    setPending(true)
    setStatus(input.intent === 'priority' && input.mode !== 'draft' ? 'Reviewing this wave…' : 'Loading evidence…')
    setOpen(true)
    setMode(input.mode ?? 'answer')
    const turnId = `${requestGeneration}-${Date.now()}`
    setTurns((current) => [...current, { id: turnId, question, body: null }])
    try {
      const response = await fetch('/api/unblocked-ai/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          requestId: turnId,
          question,
          intentHint: input.intent,
          entry: input.surface
            ? { surface: input.surface, pillarKey: input.pillarKey, recommendationId: input.recommendationId }
            : undefined,
          scope: { workspaceSlug: frame.workspaceSlug, revisionId: frame.revisionId },
          history: turns.slice(-4).flatMap((turn) =>
            turn.body?.content
              ? [
                  { role: 'user', content: turn.question },
                  { role: 'assistant', content: turn.body.content.finding.summary },
                ]
              : [],
          ),
        }),
      })
      const body = (await response.json()) as AskBody
      if (requestGeneration !== generation.current || body.scope?.workspaceSlug && body.scope.workspaceSlug !== frame.workspaceSlug) return
      if (body.kind === 'stale_context') {
        clearNow()
        setOpen(true)
        setStatus(body.message || "You're viewing a new wave. Ask again to use its results.")
        return
      }
      setTurns((current) => current.map((turn) => (turn.id === turnId ? { ...turn, body } : turn)))
      if (body.draft && (input.mode === 'draft' || input.intent === 'action')) setDraft(body.draft)
      if (input.mode === 'evidence') setPreparedEvidence(body.evidence ?? [])
      setRule(body.rule)
      setStatus(body.message || (body.source === 'unblocked_ai' ? 'UnblockedAI' : 'From your report'))
      if (response.ok) setComposer('')
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      if (requestGeneration !== generation.current) return
      setStatus('AI analysis is temporarily unavailable.')
    } finally {
      if (requestGeneration === generation.current) setPending(false)
    }
  }

  function openAsk(input: OpenRequest) {
    launcher.current = input.launcher ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    setEntry(input)
    setOpen(true)
    if (input.evidence || input.draft) {
      setPreparedEvidence(input.evidence ?? null)
      setDraft(input.draft ?? null)
      setRule(input.rule)
      setMode(input.mode ?? (input.draft ? 'draft' : 'evidence'))
      setStatus('From your report')
      return
    }
    if (input.question) void send(input)
  }

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const focusable = panel?.querySelector<HTMLElement>('button, [href], input, select, textarea')
    focusable?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>('button, [href], input, select, textarea')).filter(
        (element) => !element.hasAttribute('disabled'),
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, mode])

  const activeTurn = [...turns].reverse().find((turn) => turn.body) ?? turns[turns.length - 1]
  const evidence = preparedEvidence ?? activeTurn?.body?.evidence ?? []
  const visibleDraft = draft ?? activeTurn?.body?.draft ?? null

  return (
    <AssistantContext.Provider value={{ frame, open: openAsk, clearNow }}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-[60] md:bg-transparent">
          <button type="button" className="absolute inset-0 bg-ink/40 md:bg-ink/20 motion-reduce:transition-none" aria-label="Close UnblockedAI" onClick={close} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-0 flex flex-col bg-paper md:inset-y-0 md:left-auto md:right-0 md:w-[460px] md:border-l md:border-warm-400/30 md:bg-white md:shadow-[-12px_0_40px_rgba(12,15,20,0.08)] motion-reduce:transition-none"
          >
            <header className="border-b border-warm-400/30 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p id={titleId} className="text-base font-semibold text-ink">
                    UnblockedAI
                  </p>
                  <p className="mt-1 text-xs text-warm-600">
                    {frame.organizationName} · {frame.period}
                  </p>
                  {frame.isDemo ? <p className="mt-1 text-xs font-semibold text-accent-dark">DemoTech · Demo data</p> : null}
                  {frame.revisionId ? <p className="mt-1 truncate text-[11px] text-warm-500">Revision {frame.revisionId}</p> : null}
                </div>
                <button type="button" onClick={close} className="rounded-full border border-warm-400/40 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-cream">
                  Close
                </button>
              </div>
              {entry?.pillarKey || entry?.surface ? (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink">
                  <span className="rounded-full border border-accent/40 bg-accent-soft/70 px-2.5 py-1 font-semibold text-accent-dark">
                    {entry.surface ? SURFACE_LABEL[entry.surface] : 'This wave'}
                    {entry.pillarKey ? ` · ${entry.pillarKey}` : ''}
                  </span>
                  {entry.pillarKey ? (
                    <button type="button" className="font-semibold text-accent-dark hover:text-ink" onClick={() => setEntry({ ...entry, pillarKey: undefined })}>
                      Clear
                    </button>
                  ) : null}
                </p>
              ) : null}
            </header>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <p className="sr-only" role="status" aria-live="polite">
                {status}
              </p>
              {status ? <p className="mb-3 text-xs font-medium text-warm-600">{status}</p> : null}
              {mode === 'evidence' ? (
                <EvidenceView evidence={evidence} rule={rule} onBack={() => setMode(activeTurn?.body ? 'answer' : 'answer')} />
              ) : null}
              {mode === 'draft' && visibleDraft ? (
                <DraftForm
                  draft={visibleDraft}
                  writable={frame.actionsWritable}
                  members={frame.members}
                  slug={frame.workspaceSlug}
                  revisionId={frame.revisionId}
                  onBack={() => setMode('answer')}
                  onEvidence={() => setMode('evidence')}
                />
              ) : null}
              {mode === 'answer' ? (
                <div className="space-y-4">
                  {!turns.length ? (
                    <ul className="space-y-2">
                      {frame.prompts.map((prompt) => (
                        <li key={prompt.id}>
                          <button
                            type="button"
                            disabled={!prompt.available || pending}
                            onClick={() => send({ question: prompt.question, intent: prompt.intent, surface: 'unblocked_ai' })}
                            className="w-full rounded-xl border border-accent/30 bg-white px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-accent-soft/50 disabled:cursor-not-allowed disabled:border-warm-400/30 disabled:text-warm-500"
                          >
                            {prompt.label}
                          </button>
                          {!prompt.available && prompt.reason ? <p className="mt-1 text-xs text-warm-500">{prompt.reason}</p> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {turns.map((turn) => (
                    <article key={turn.id} className="space-y-3">
                      <p className="text-sm font-semibold text-ink">{turn.question}</p>
                      {!turn.body ? <p className="text-sm text-warm-500">Reviewing this wave…</p> : (
                        <AnswerBody
                          body={turn.body}
                          onEvidence={() => {
                            setPreparedEvidence(turn.body?.evidence ?? [])
                            setMode('evidence')
                          }}
                          onDraft={() => {
                            setDraft(turn.body?.draft ?? null)
                            setMode('draft')
                          }}
                          onChoose={(option) => {
                            if (option.intent === 'priority' || option.clearFilter) {
                              void send({ question: 'What should we fix first?', intent: 'priority', surface: entry?.surface ?? 'unblocked_ai' })
                              return
                            }
                            if (option.pillarKey) {
                              void send({
                                question: `Why is ${option.label.toLowerCase()} low?`,
                                intent: 'explain',
                                pillarKey: option.pillarKey,
                                surface: entry?.surface ?? 'unblocked_ai',
                              })
                              return
                            }
                            if (option.value) {
                              void send({
                                question: `Is this worse for ${option.value}?`,
                                intent: 'segment',
                                surface: entry?.surface ?? 'unblocked_ai',
                              })
                            }
                          }}
                        />
                      )}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
            <form
              className="border-t border-warm-400/30 px-4 py-3 sm:px-5"
              onSubmit={(event) => {
                event.preventDefault()
                void send({ question: composer, surface: entry?.surface ?? 'unblocked_ai', pillarKey: entry?.pillarKey, recommendationId: entry?.recommendationId })
              }}
            >
              <label className="block text-xs font-semibold text-warm-600" htmlFor="unblocked-ai-composer">
                Ask about this wave
              </label>
              <textarea
                id="unblocked-ai-composer"
                value={composer}
                onChange={(event) => setComposer(event.target.value)}
                rows={2}
                placeholder="Ask about this wave…"
                className="mt-2 w-full resize-y rounded-xl border border-warm-400/40 bg-white px-3 py-2 text-sm text-ink"
              />
              <div className="mt-2 flex justify-end">
                <button type="submit" disabled={pending || !composer.trim()} className="rounded-full bg-accent-dark px-4 py-2 text-sm font-semibold text-white hover:bg-ink disabled:opacity-50">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AssistantContext.Provider>
  )
}

function AnswerBody({
  body,
  onEvidence,
  onDraft,
  onChoose,
}: {
  body: AskBody
  onEvidence: () => void
  onDraft: () => void
  onChoose: (option: NonNullable<AskBody['clarify']>['options'][number]) => void
}) {
  const chips = chipLabels(body.evidence, body.content?.finding.evidenceIds)
  return (
    <div className="space-y-3">
      {body.message ? <p className="text-sm text-warm-600">{body.message}</p> : null}
      {body.content ? <p className="text-sm leading-relaxed text-ink">{body.content.finding.summary}</p> : null}
      {chips.length ? (
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip} className="rounded-full border border-accent/30 bg-accent-soft/70 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink">
              {chip}
            </li>
          ))}
        </ul>
      ) : null}
      {body.content?.interpretation ? <p className="text-sm leading-relaxed text-warm-600">{body.content.interpretation.hypothesis}</p> : null}
      {body.content?.nextStep ? (
        <p className="text-sm text-ink">
          <span className="font-semibold">{body.content.nextStep.suggestedOwnerFunction}. </span>
          {body.content.nextStep.firstStep}
        </p>
      ) : null}
      {body.content?.followUpQuestion ? <p className="text-sm text-warm-600">Draft question: {body.content.followUpQuestion}</p> : null}
      <div className="flex flex-wrap gap-3">
        {body.evidence?.length ? (
          <button type="button" onClick={onEvidence} className="text-sm font-semibold text-accent-dark hover:text-ink">
            View evidence
          </button>
        ) : null}
        {body.draft ? (
          <button type="button" onClick={onDraft} className="text-sm font-semibold text-accent-dark hover:text-ink">
            Draft an action
          </button>
        ) : null}
      </div>
      {body.clarify ? (
        <div className="space-y-2">
          <p className="text-sm text-ink">{body.clarify.question}</p>
          <div className="flex flex-wrap gap-2">
            {body.clarify.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChoose(option)}
                className="rounded-full border border-accent/40 bg-white px-2.5 py-1 text-xs font-semibold text-ink hover:bg-accent-soft/60"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-500">{body.source === 'unblocked_ai' ? 'UnblockedAI' : 'From your report'}</p>
    </div>
  )
}

function EvidenceView({ evidence, rule, onBack }: { evidence: EvidenceItem[]; rule?: string; onBack: () => void }) {
  const metrics = evidence.filter((item) => item.kind === 'metric')
  const excerpts = evidence.filter((item) => item.kind === 'excerpt')
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-accent-dark hover:text-ink">
        Back to the answer
      </button>
      {rule ? <p className="text-xs leading-relaxed text-warm-600">{rule}</p> : null}
      {metrics.map((item) =>
        item.kind === 'metric' ? (
          <section key={item.id} className="rounded-xl border border-warm-400/30 bg-white p-3">
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
              {item.value}
              {item.unit === 'index_0_100' ? <span className="text-base text-warm-500">/100</span> : null}
            </p>
            {item.validCount != null ? (
              <p className="mt-1 text-xs tabular-nums text-warm-600">
                {item.validCount} valid ratings{item.eligibleCount != null ? ` across ${item.eligibleCount} submissions` : ''}
              </p>
            ) : null}
            {item.comparison ? (
              <p className="mt-2 text-xs text-warm-600">
                {item.comparison.label}: {item.comparison.value} from {item.comparison.validCount} valid ratings
              </p>
            ) : null}
            {item.detail ? <p className="mt-2 text-sm leading-relaxed text-warm-600">{item.detail}</p> : null}
          </section>
        ) : null,
      )}
      {excerpts.length ? (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-500">Seller comments</h3>
          <ul className="mt-2 space-y-3">
            {excerpts.map((item) =>
              item.kind === 'excerpt' ? (
                <li key={item.id} className="border-l-2 border-accent/60 pl-3 text-sm leading-relaxed text-warm-700">
                  {item.stance === 'contrary' ? <span className="mb-1 block text-xs font-semibold text-warm-500">A different report</span> : null}
                  “{item.redactedText}”
                  {item.listed === false ? <span className="mt-1 block text-xs text-warm-500">This excerpt is outside the Responses list.</span> : null}
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
      <div className="flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/app/diagnostics" className="text-accent-dark hover:text-ink">
          Open diagnostics
        </Link>
        <Link href="/app/responses" className="text-accent-dark hover:text-ink">
          Open responses
        </Link>
      </div>
    </div>
  )
}

function DraftForm({
  draft,
  writable,
  members,
  slug,
  revisionId,
  onBack,
  onEvidence,
}: {
  draft: DraftAction
  writable: boolean
  members: { id: string; name: string }[]
  slug: string
  revisionId: string | null
  onBack: () => void
  onEvidence: () => void
}) {
  const [title, setTitle] = useState(draft.title)
  const [promptedBy, setPromptedBy] = useState(draft.promptedBy)
  const [owner, setOwner] = useState(draft.suggestedOwnerFunction)
  const [firstStep, setFirstStep] = useState(draft.firstStep)
  const [measure, setMeasure] = useState(draft.measure)
  const [baseline, setBaseline] = useState(draft.baseline)
  const [assignee, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [copied, setCopied] = useState(false)
  const [savedHref, setSavedHref] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [key] = useState(() => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `draft-${Date.now()}`))

  useEffect(() => {
    setTitle(draft.title)
    setPromptedBy(draft.promptedBy)
    setOwner(draft.suggestedOwnerFunction)
    setFirstStep(draft.firstStep)
    setMeasure(draft.measure)
    setBaseline(draft.baseline)
    setSavedHref(null)
  }, [draft])

  const edited: DraftAction = { ...draft, title, promptedBy, suggestedOwnerFunction: owner, firstStep, measure, baseline }

  async function copy() {
    const text = copyDraft(edited)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
      setError('Copy this draft from the fields above.')
    }
  }

  async function save() {
    setError('')
    const response = await fetch('/api/unblocked-ai/actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        idempotencyKey: key,
        title,
        promptedBy,
        ownerFunction: owner,
        assignee,
        dueDate,
        firstStep,
        measure,
        baseline,
        baselineScore: draft.baselineScore,
        baselineValidCount: draft.baselineValidCount,
        sourceWave: draft.sourceWave,
        evidenceIds: draft.evidenceIds,
        pillarKey: draft.pillarKey,
        recommendationId: draft.recommendationId,
        followUpQuestion: draft.followUpQuestion,
        workspaceSlug: slug,
        revisionId,
      }),
    })
    const body = (await response.json()) as { ok?: boolean; href?: string; message?: string }
    if (!response.ok || !body.ok) {
      setError(body.message || 'The draft could not be saved.')
      return
    }
    setSavedHref(body.href || '/app/actions')
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
    >
      <button type="button" onClick={onBack} className="text-sm font-semibold text-accent-dark hover:text-ink">
        Back to the answer
      </button>
      <h3 className="text-lg font-semibold text-ink">Draft action</h3>
      <Field label="Title" value={title} onChange={setTitle} />
      <Field label="What prompted it" value={promptedBy} onChange={setPromptedBy} multiline />
      <Field label="Owner function" value={owner} onChange={setOwner} />
      <Field label="First step" value={firstStep} onChange={setFirstStep} multiline />
      <Field label="Measure" value={measure} onChange={setMeasure} multiline />
      <Field label="Baseline" value={baseline} onChange={setBaseline} />
      <p className="text-xs text-warm-500">Source wave: {draft.sourceWave}</p>
      {draft.followUpQuestion ? <p className="text-sm text-warm-600">Follow-up question, draft for a future wave: {draft.followUpQuestion}</p> : null}
      <button type="button" onClick={onEvidence} className="text-sm font-semibold text-accent-dark hover:text-ink">
        View evidence
      </button>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void copy()} className="rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-ink">
          {copied ? 'Copied' : 'Copy draft'}
        </button>
        {writable ? (
          <>
            <label className="text-xs text-warm-600">
              Assignee
              <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className="mt-1 block rounded-xl border border-warm-400/40 bg-white px-2 py-1.5 text-sm text-ink">
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-warm-600">
              Due date
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 block rounded-xl border border-warm-400/40 bg-white px-2 py-1.5 text-sm text-ink" />
            </label>
            <button type="submit" className="self-end rounded-full bg-accent-dark px-4 py-2 text-sm font-semibold text-white hover:bg-ink">
              Save to Actions
            </button>
          </>
        ) : (
          <p className="text-xs text-warm-500">Saving is unavailable in this environment. Copy the draft instead.</p>
        )}
      </div>
      {savedHref ? (
        <p className="text-sm text-ink">
          Saved.{' '}
          <Link href={savedHref} className="font-semibold text-accent-dark hover:text-ink">
            Open Actions
          </Link>
        </p>
      ) : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </form>
  )
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, '-')
  const className = 'mt-1 w-full rounded-xl border border-warm-400/40 bg-white px-3 py-2 text-sm text-ink'
  return (
    <label className="block text-xs font-semibold text-warm-600" htmlFor={id}>
      {label}
      {multiline ? <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className={className} /> : <input id={id} value={value} onChange={(event) => onChange(event.target.value)} className={className} />}
    </label>
  )
}
