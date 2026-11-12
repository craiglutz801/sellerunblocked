import type { PillarKey } from '@/lib/types/platform'
import { pillarFromText } from '@/lib/unblocked-ai/policy'
import type { FilterField, IntentHint } from '@/lib/unblocked-ai/types'
import { distinctContributors, type WaveData, type WaveRow } from '@/lib/unblocked-ai/wave'
import { MIN_COHORT_CONTRIBUTORS } from '@/lib/unblocked-ai/policy'

export type Cohort = {
  field: FilterField
  label: string
  values: string[]
  rows: WaveRow[]
  contributors: number
}

export type ResolvedIntent =
  | { type: 'priority' }
  | { type: 'explain'; pillar?: PillarKey }
  | { type: 'segment'; query: string; pillar?: PillarKey }
  | { type: 'change'; pillar?: PillarKey }
  | { type: 'benchmark' }
  | { type: 'follow_up'; pillar?: PillarKey }
  | { type: 'action'; pillar?: PillarKey }
  | { type: 'stage'; name?: string }
  | { type: 'unsupported' }

const KNOWN: { phrase: string; intent: ResolvedIntent }[] = [
  { phrase: 'what should we fix first', intent: { type: 'priority' } },
  { phrase: 'why is support low', intent: { type: 'explain', pillar: 'support' } },
  { phrase: 'what are sellers saying about support', intent: { type: 'explain', pillar: 'support' } },
  { phrase: 'is this worse for account executives', intent: { type: 'segment', query: 'account executives' } },
  { phrase: 'what changed', intent: { type: 'change' } },
  { phrase: 'what changed since the previous wave', intent: { type: 'change' } },
  { phrase: 'how do we compare to peers', intent: { type: 'benchmark' } },
  { phrase: 'what should i ask next', intent: { type: 'follow_up' } },
  { phrase: 'draft an action for this', intent: { type: 'action' } },
]

export function normalizeQuestion(question: string): string {
  return question.toLowerCase().replace(/[?.!]+$/g, '').replace(/\s+/g, ' ').trim()
}

export function intentFromHint(hint: IntentHint, pillar?: PillarKey, question?: string): ResolvedIntent {
  if (hint === 'explain') return { type: 'explain', pillar: pillar ?? pillarFromText(question ?? '') }
  if (hint === 'segment') return { type: 'segment', query: question ?? '', pillar }
  if (hint === 'change') return { type: 'change', pillar }
  if (hint === 'follow_up') return { type: 'follow_up', pillar }
  if (hint === 'action') return { type: 'action', pillar }
  if (hint === 'benchmark') return { type: 'benchmark' }
  return { type: 'priority' }
}

export function resolveIntent(question: string, hint?: IntentHint, pillar?: PillarKey): ResolvedIntent {
  if (hint) return intentFromHint(hint, pillar, question)
  const text = normalizeQuestion(question)
  const known = KNOWN.find((item) => item.phrase === text)
  if (known) {
    if (pillar && (known.intent.type === 'explain' || known.intent.type === 'action' || known.intent.type === 'change' || known.intent.type === 'follow_up')) {
      return { ...known.intent, pillar }
    }
    return known.intent
  }
  if (/what should we fix|fix first|highest priority|lowest scor/.test(text)) return { type: 'priority' }
  if (/what changed|previous wave|since the last|since last|compared with last/.test(text)) return { type: 'change', pillar: pillarFromText(text) }
  if (/peer|benchmark/.test(text)) return { type: 'benchmark' }
  if (/what should i ask|ask next|follow-up question|follow up question/.test(text)) return { type: 'follow_up', pillar: pillar ?? pillarFromText(text) }
  if (/draft an action|draft action/.test(text)) return { type: 'action', pillar: pillar ?? pillarFromText(text) }
  const saying = /saying about ([a-z ]+)/.exec(text)
  if (saying) return { type: 'explain', pillar: pillarFromText(saying[1]) ?? pillar }
  const why = /why (?:is|are) ([a-z ]+?) (?:low|weak|behind|down)/.exec(text)
  if (why) return { type: 'explain', pillar: pillarFromText(why[1]) ?? pillar }
  const worse = /(?:worse|better|different) for ([a-z0-9][a-z0-9 '’-]+)/.exec(text)
  if (worse) return { type: 'segment', query: worse[1].trim(), pillar: pillar ?? pillarFromText(text) }
  if (/discover|qualify|propose|negotiate|\bclose\b|demo stage|stage question/.test(text)) {
    const name = ['discover', 'qualify', 'demo', 'propose', 'negotiate', 'close'].find((stage) => text.includes(stage))
    return { type: 'stage', name }
  }
  const mentioned = pillarFromText(text)
  if (mentioned && /why|explain|low|comment/.test(text)) return { type: 'explain', pillar: mentioned }
  return { type: 'unsupported' }
}

function words(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.endsWith('s') && word.length > 3 ? word.slice(0, -1) : word))
}

const ALIAS: Record<string, string[]> = {
  ae: ['account', 'executive'],
  account: ['ae'],
  executive: ['ae'],
}

function wordHit(queryWord: string, valueWords: string[]): boolean {
  if (valueWords.includes(queryWord)) return true
  const aliases = ALIAS[queryWord] ?? []
  return aliases.every((alias) => valueWords.includes(alias)) && aliases.length > 0
}

export function valueMatches(query: string, value: string): boolean {
  const left = words(query)
  const right = words(value)
  if (!left.length || !right.length) return false
  if (left.join(' ') === right.join(' ')) return true
  return left.every((word) => wordHit(word, right))
}

export function groupValues(wave: WaveData, field: FilterField): { value: string; rows: WaveRow[] }[] {
  const groups = new Map<string, WaveRow[]>()
  for (const row of wave.rows) {
    const value = row[field].trim()
    if (!value) continue
    const list = groups.get(value) ?? []
    list.push(row)
    groups.set(value, list)
  }
  return Array.from(groups.entries())
    .map(([value, rows]) => ({ value, rows }))
    .sort((a, b) => a.value.localeCompare(b.value))
}

export function resolveCohort(wave: WaveData, query: string): { cohort?: Cohort; ambiguous?: { field: FilterField; value: string }[] } {
  const matches: { field: FilterField; value: string; rows: WaveRow[] }[] = []
  for (const field of ['role', 'region'] as const) {
    for (const group of groupValues(wave, field)) {
      if (valueMatches(query, group.value)) matches.push({ field, ...group })
    }
  }
  if (!matches.length) return {}
  const fields = new Set(matches.map((match) => match.field))
  if (fields.size > 1) {
    return { ambiguous: matches.map((match) => ({ field: match.field, value: match.value })) }
  }
  const field = matches[0].field
  const rows = matches.flatMap((match) => match.rows)
  const values = matches.map((match) => match.value)
  const label = values.length === 1 ? values[0] : `${query} (${values.join(', ')})`
  return {
    cohort: {
      field,
      label,
      values,
      rows,
      contributors: distinctContributors(rows),
    },
  }
}

export function supportedGroups(wave: WaveData, field: FilterField): { value: string; contributors: number }[] {
  return groupValues(wave, field)
    .map((group) => ({ value: group.value, contributors: distinctContributors(group.rows) }))
    .filter((group) => group.contributors >= MIN_COHORT_CONTRIBUTORS)
}
