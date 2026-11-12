import { createHash } from 'crypto'
import { CustomerDataError } from '@/lib/customers/access'
import { BASELINE_COLUMNS, MAX_IMPORT_ROWS, MISSING_RATING_TOKENS, RATING_COLUMNS, type RatingKey } from '@/lib/customers/schema'
import type { ImportIssue, StoredSubmission } from '@/lib/customers/types'

const MISSING = new Set(MISSING_RATING_TOKENS)
const EMAILISH = /@/

export type MappingTarget = (typeof BASELINE_COLUMNS)[number]['key'] | 'ignore'

export type ColumnMapping = {
  source: string
  target: MappingTarget
}

export type MappingColumn = {
  source: string
  samples: string[]
  suggested: MappingTarget | null
}

export type MappingReview = {
  signature: string
  columns: MappingColumn[]
  targets: { key: MappingTarget; label: string }[]
}

export type ParsedCsv = {
  submissions: StoredSubmission[]
  errors: ImportIssue[]
  warnings: ImportIssue[]
  needsMapping: boolean
  review: MappingReview | null
}

const TARGET_LABELS: Record<MappingTarget, string> = {
  ignore: 'Ignore this column',
  response_id: 'Response id',
  respondent_id: 'Respondent id',
  response_date: 'Response date',
  region: 'Region',
  role: 'Role',
  process_clarity: 'Process clarity (1–5)',
  tool_burden: 'Tool load (1–5)',
  enablement_readiness: 'Enablement (1–5)',
  message_alignment: 'Message alignment (1–5)',
  support_speed: 'Support speed (1–5)',
  comp_clarity: 'Compensation clarity (1–5)',
  open_friction: 'Open comment',
}

const KNOWN_TARGETS = new Set<string>(BASELINE_COLUMNS.map((column) => column.key))

export function headerSignature(headers: string[]): string {
  return headers.filter(Boolean).slice().sort().join('\n')
}

export function mappingTargets(): { key: MappingTarget; label: string }[] {
  return (Object.keys(TARGET_LABELS) as MappingTarget[]).map((key) => ({ key, label: TARGET_LABELS[key] }))
}

export class MappingRequiredError extends CustomerDataError {
  review: MappingReview

  constructor(review: MappingReview, errors: ImportIssue[] = []) {
    super('This file needs a column mapping before it can publish.', 409, errors)
    this.name = 'MappingRequiredError'
    this.review = review
  }
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

function headerKey(value: string): string {
  return value.replace(/^\uFEFF/, '').trim().toLowerCase().replace(/\s+/g, '_')
}

function isMissingRating(value: string): boolean {
  return MISSING.has(value.trim().toLowerCase())
}

function emptyRatings(): Record<RatingKey, number | null> {
  return {
    process_clarity: null,
    tool_burden: null,
    enablement_readiness: null,
    message_alignment: null,
    support_speed: null,
    comp_clarity: null,
  }
}

function emptyParse(errors: ImportIssue[], warnings: ImportIssue[] = [], review: MappingReview | null = null): ParsedCsv {
  return { submissions: [], errors, warnings, needsMapping: false, review }
}

function buildReview(headers: string[], body: string[]): MappingReview {
  return {
    signature: headerSignature(headers),
    columns: headers.map((source, index) => ({
      source,
      suggested: KNOWN_TARGETS.has(source) ? (source as MappingTarget) : null,
      samples: body
        .map((line) => parseCsvLine(line)[index]?.trim() ?? '')
        .filter(Boolean)
        .slice(0, 3)
        .map((sample) => sample.slice(0, 80)),
    })),
    targets: mappingTargets(),
  }
}

function isMappingTarget(value: string): value is MappingTarget {
  return value === 'ignore' || KNOWN_TARGETS.has(value)
}

export function parseBaselineCsv(csv: string, mapping?: ColumnMapping[] | null): ParsedCsv {
  const warnings: ImportIssue[] = []
  const text = csv.replace(/^\uFEFF/, '')
  const lines = text.split(/\r?\n/).filter((line, index, all) => line.length > 0 || index < all.length - 1)
  const filled = lines.filter((line) => line.trim().length > 0)
  if (!filled.length) return emptyParse([{ message: 'The CSV is empty.' }])

  const headers = parseCsvLine(filled[0]).map(headerKey)
  const headerErrors: ImportIssue[] = []
  const seen = new Set<string>()
  headers.forEach((header, index) => {
    if (!header) headerErrors.push({ row: 1, column: `column ${index + 1}`, message: 'Header is blank.' })
    else if (seen.has(header)) headerErrors.push({ row: 1, column: header, message: 'Duplicate column.' })
    seen.add(header)
  })
  if (headerErrors.length) return emptyParse(headerErrors)

  const body = filled.slice(1)
  if (!body.length) return emptyParse([{ message: 'The CSV has a header and no response rows.' }])
  if (body.length > MAX_IMPORT_ROWS) {
    return emptyParse([{ message: `CSV has ${body.length} rows. The limit is ${MAX_IMPORT_ROWS}.` }])
  }

  const review = buildReview(headers, body)
  const unknown = headers.filter((header) => !KNOWN_TARGETS.has(header))
  let targets: Map<string, MappingTarget>
  if (unknown.length === 0 && !mapping) {
    if (!seen.has('response_id')) {
      return emptyParse([{ row: 1, column: 'response_id', message: 'response_id column is required.' }])
    }
    targets = new Map(headers.map((header) => [header, header as MappingTarget]))
  } else {
    if (!mapping) return { submissions: [], errors: [], warnings, needsMapping: true, review }
    const supplied = new Map<string, MappingTarget>()
    const mappingErrors: ImportIssue[] = []
    for (const column of mapping) {
      const source = headerKey(column.source)
      if (!seen.has(source)) {
        mappingErrors.push({ column: source, message: 'That column is not in this file.' })
        continue
      }
      if (!isMappingTarget(column.target)) {
        mappingErrors.push({ column: source, message: 'Choose a baseline field or ignore.' })
        continue
      }
      supplied.set(source, column.target)
    }
    for (const header of headers) {
      if (!supplied.has(header)) mappingErrors.push({ column: header, message: 'Choose a baseline field or ignore.' })
    }
    const used = new Map<string, string>()
    supplied.forEach((target, source) => {
      if (target === 'ignore') return
      const prior = used.get(target)
      if (prior) mappingErrors.push({ column: source, message: `${target} is already mapped from ${prior}.` })
      else used.set(target, source)
    })
    if (!used.has('response_id')) {
      mappingErrors.push({ column: 'response_id', message: 'Map one column to response id.' })
    }
    if (mappingErrors.length) return { submissions: [], errors: mappingErrors, warnings, needsMapping: true, review }
    targets = supplied
  }

  const indexOf = (target: string) => headers.findIndex((header) => targets.get(header) === target)
  const errors: ImportIssue[] = []
  const submissions: StoredSubmission[] = []
  const ids = new Set<string>()

  body.forEach((line, offset) => {
    const rowNumber = offset + 2
    const values = parseCsvLine(line).map((value) => value.trim())
    const read = (target: string) => {
      const index = indexOf(target)
      return index === -1 ? '' : (values[index] ?? '')
    }
    const responseId = read('response_id')
    if (!responseId) {
      errors.push({ row: rowNumber, column: 'response_id', message: 'response_id is required.' })
      return
    }
    if (responseId.length > 80) {
      errors.push({ row: rowNumber, column: 'response_id', message: 'response_id is longer than 80 characters.' })
      return
    }
    if (ids.has(responseId)) {
      errors.push({ row: rowNumber, column: 'response_id', message: `Duplicate response_id ${responseId}.` })
      return
    }
    ids.add(responseId)

    const responseDate = read('response_date')
    if (responseDate && !/^\d{4}-\d{2}-\d{2}$/.test(responseDate)) {
      errors.push({ row: rowNumber, column: 'response_date', message: 'Use YYYY-MM-DD or leave the date blank.' })
      return
    }

    const ratings = emptyRatings()
    for (const column of RATING_COLUMNS) {
      const raw = read(column.key)
      if (isMissingRating(raw)) {
        ratings[column.key] = null
        continue
      }
      const numeric = Number(raw)
      if (!Number.isInteger(numeric) || numeric < 1 || numeric > 5) {
        errors.push({
          row: rowNumber,
          column: column.key,
          message: 'Rating must be a whole number from 1 to 5, or blank / N/A / Don\'t know.',
        })
        return
      }
      ratings[column.key] = numeric
    }

    const respondentId = read('respondent_id').slice(0, 80)
    if (respondentId && EMAILISH.test(respondentId)) {
      warnings.push({
        row: rowNumber,
        column: 'respondent_id',
        message: 'This looks like an email. Prefer an internal code, not a personal address.',
      })
    }
    const openFriction = read('open_friction')
    if (openFriction.length > 4000) {
      errors.push({ row: rowNumber, column: 'open_friction', message: 'Open text is longer than 4000 characters.' })
      return
    }

    submissions.push({
      responseId,
      respondentId,
      responseDate: responseDate || null,
      region: read('region').slice(0, 80),
      role: read('role').slice(0, 80),
      ratings,
      openFriction,
    })
  })

  return {
    submissions: errors.length ? [] : submissions,
    errors,
    warnings,
    needsMapping: false,
    review: unknown.length || mapping ? review : null,
  }
}

export function submissionHash(submissions: StoredSubmission[]): string {
  const canonical = [...submissions]
    .sort((a, b) => a.responseId.localeCompare(b.responseId))
    .map((submission) => ({
      responseId: submission.responseId,
      respondentId: submission.respondentId,
      responseDate: submission.responseDate,
      region: submission.region,
      role: submission.role,
      ratings: submission.ratings,
      openFriction: submission.openFriction.trim(),
    }))
  return createHash('sha256').update(JSON.stringify(canonical)).digest('hex')
}
