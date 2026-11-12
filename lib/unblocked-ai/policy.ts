import type { PillarKey } from '@/lib/types/platform'

/**
 * Product defaults for UnblockedAI.
 * A pillar is ranked only with at least MIN_VALID_RATINGS valid ratings.
 * A region or role is shown only with at least MIN_COHORT_CONTRIBUTORS distinct
 * contributors. The same floor blocks a direct evidence read, so a hidden
 * group cannot be opened through a citation.
 * Contributor identity is the respondent id when the row has one, otherwise the
 * submission id. Identity fields are not sent to a model.
 */
export const MIN_VALID_RATINGS = 5
export const MIN_COHORT_CONTRIBUTORS = 5
export const MAX_EXCERPTS = 8
export const MAX_HISTORY_TURNS = 6
export const MAX_QUESTION_CHARS = 2_000

export const PRIORITY_RULE =
  'Lowest scoring areas with at least 5 valid ratings. Ties break toward greater valid coverage, then pillar key.'

export const INDEX_FORMULA =
  'Each 1–5 rating becomes 100 × (rating − 1) / 4. The index is the rounded mean of those values. Missing answers are excluded and are not stored as zero.'

export const PILLAR_ORDER: PillarKey[] = ['alignment', 'compensation', 'enablement', 'process', 'support', 'tools']

export const OWNER_FUNCTION: Record<PillarKey, string> = {
  process: 'Sales leadership',
  tools: 'RevOps',
  enablement: 'Enablement',
  alignment: 'Product marketing',
  support: 'RevOps',
  compensation: 'Sales leadership',
}

const PILLAR_WORDS: Record<PillarKey, string[]> = {
  process: ['process', 'process clarity'],
  tools: ['tools', 'tool', 'tool burden'],
  enablement: ['enablement'],
  alignment: ['alignment', 'message'],
  support: ['support'],
  compensation: ['compensation', 'comp', 'pay'],
}

export function pillarFromText(text: string): PillarKey | undefined {
  const value = text.toLowerCase()
  const found = (Object.keys(PILLAR_WORDS) as PillarKey[]).filter((pillar) =>
    PILLAR_WORDS[pillar].some((word) => new RegExp(`\\b${word}\\b`, 'i').test(value)),
  )
  return found.length === 1 ? found[0] : undefined
}

export function pillarKeyForRecommendation(id: string): PillarKey | undefined {
  const match = /^rec-(process|tools|enablement|alignment|support|compensation)$/.exec(id)
  if (match) return match[1] as PillarKey
  if (id === 'rec-1') return 'support'
  if (id === 'rec-2') return 'alignment'
  if (id === 'rec-3') return 'enablement'
  return undefined
}
