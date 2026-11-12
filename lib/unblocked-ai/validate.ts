import { numbersIn } from '@/lib/unblocked-ai/redact'
import type { EvidenceItem } from '@/lib/unblocked-ai/types'

function add(allowed: Set<string>, value: number | undefined) {
  if (value == null || !Number.isFinite(value)) return
  allowed.add(String(value))
  allowed.add(String(Math.abs(value)))
}

export function allowedNumbers(evidence: EvidenceItem[], contextText: string[] = []): Set<string> {
  const allowed = new Set<string>()
  let indexScale = false
  for (const item of evidence) {
    if (item.kind !== 'metric') continue
    add(allowed, item.value)
    if (item.unit === 'index_0_100') indexScale = true
    add(allowed, item.validCount)
    add(allowed, item.eligibleCount)
    if (item.comparison) {
      add(allowed, item.comparison.value)
      add(allowed, item.comparison.validCount)
      add(allowed, item.value - item.comparison.value)
    }
  }
  if (indexScale) allowed.add('100')
  for (const text of contextText) {
    for (const value of numbersIn(text)) allowed.add(value)
  }
  return allowed
}

/** True when every number in the text is a validated evidence value or a known period label. */
export function isGrounded(text: string, evidence: EvidenceItem[], contextText: string[] = []): boolean {
  const allowed = allowedNumbers(evidence, contextText)
  return numbersIn(text).every((value) => allowed.has(value))
}

export function evidenceIds(evidence: EvidenceItem[]): Set<string> {
  return new Set(evidence.map((item) => item.id))
}

export function citesKnownEvidence(ids: string[] | undefined, known: Set<string>): boolean {
  return Boolean(ids?.length) && ids!.every((id) => known.has(id))
}
