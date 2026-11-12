import type { PillarKey } from '@/lib/types/platform'
import type { WaveRow } from '@/lib/unblocked-ai/wave'

const PILLAR_PATTERN: Record<PillarKey, RegExp> = {
  process: /process|stage|handoff|forecast|pipeline/i,
  tools: /\btools?\b|crm|spreadsheet|admin/i,
  enablement: /enablement|coach|practice|playbook|objection/i,
  alignment: /marketing|message|proof|\broi\b|\bmql\b/i,
  support: /support|deal desk|legal|specialist|quote|exception|approval|delay|wait/i,
  compensation: /comp|spiff|quota|accelerator|\bpaid\b/i,
}

const CONTRARY = /same day|right away|quickly|no delay|no wait|immediately/i

export type SelectedComment = {
  responseId: string
  contributorKey: string
  questionKey: string
  questionLabel: string
  text: string
  contrary: boolean
}

export function eligibleComments(rows: WaveRow[]): number {
  return rows.reduce((count, row) => count + row.comments.length, 0)
}

/** Stable, bounded comment selection. One comment per submission is preferred. */
export function selectComments(rows: WaveRow[], pillar: PillarKey, limit: number): SelectedComment[] {
  const pattern = PILLAR_PATTERN[pillar]
  const hits: SelectedComment[] = []
  for (const row of rows) {
    for (const comment of row.comments) {
      if (!pattern.test(comment.text)) continue
      hits.push({
        responseId: row.responseId,
        contributorKey: row.contributorKey,
        questionKey: comment.questionKey,
        questionLabel: comment.questionLabel,
        text: comment.text,
        contrary: CONTRARY.test(comment.text),
      })
    }
  }
  hits.sort((a, b) => a.responseId.localeCompare(b.responseId) || a.questionKey.localeCompare(b.questionKey))
  const seen = new Set<string>()
  const first: SelectedComment[] = []
  const extra: SelectedComment[] = []
  for (const hit of hits) {
    if (seen.has(hit.responseId)) extra.push(hit)
    else {
      seen.add(hit.responseId)
      first.push(hit)
    }
  }
  return [...first, ...extra].slice(0, limit)
}

/** A recurring quote-exception delay needs two or more distinct contributors. */
export function quoteExceptionDelay(comments: SelectedComment[]): boolean {
  const contributors = new Set(
    comments
      .filter((comment) => /quote exception|needs an exception/i.test(comment.text) && /delay|wait|days/i.test(comment.text))
      .map((comment) => comment.contributorKey),
  )
  return contributors.size >= 2
}

export function mentionsDelay(comments: SelectedComment[]): boolean {
  return comments.some((comment) => /delay|wait|days/i.test(comment.text) && !comment.contrary)
}
