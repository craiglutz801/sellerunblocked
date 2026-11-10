import { createHash } from 'crypto'
import { BASELINE_COLUMNS, MAX_IMPORT_ROWS, MISSING_RATING_TOKENS, RATING_COLUMNS, type RatingKey } from '@/lib/customers/schema'
import type { ImportIssue, StoredSubmission } from '@/lib/customers/types'

const MISSING = new Set(MISSING_RATING_TOKENS)
const EMAILISH = /@/

export type ParsedCsv = {
  submissions: StoredSubmission[]
  errors: ImportIssue[]
  warnings: ImportIssue[]
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

export function parseBaselineCsv(csv: string): ParsedCsv {
  const errors: ImportIssue[] = []
  const warnings: ImportIssue[] = []
  const text = csv.replace(/^\uFEFF/, '')
  const lines = text.split(/\r?\n/).filter((line, index, all) => line.length > 0 || index < all.length - 1)
  const filled = lines.filter((line) => line.trim().length > 0)
  if (!filled.length) {
    return { submissions: [], errors: [{ message: 'The CSV is empty.' }], warnings }
  }

  const headers = parseCsvLine(filled[0]).map(headerKey)
  const known = new Set(BASELINE_COLUMNS.map((column) => column.key))
  const seen = new Set<string>()
  headers.forEach((header, index) => {
    if (!header) errors.push({ row: 1, column: `column ${index + 1}`, message: 'Header is blank.' })
    else if (seen.has(header)) errors.push({ row: 1, column: header, message: 'Duplicate column.' })
    else if (!known.has(header as (typeof BASELINE_COLUMNS)[number]['key'])) {
      warnings.push({ row: 1, column: header, message: 'Unknown column ignored.' })
    }
    seen.add(header)
  })
  if (!seen.has('response_id')) {
    errors.push({ row: 1, column: 'response_id', message: 'response_id column is required.' })
  }
  if (errors.length) return { submissions: [], errors, warnings }

  const body = filled.slice(1)
  if (!body.length) {
    return { submissions: [], errors: [{ message: 'The CSV has a header and no response rows.' }], warnings }
  }
  if (body.length > MAX_IMPORT_ROWS) {
    return {
      submissions: [],
      errors: [{ message: `CSV has ${body.length} rows. The limit is ${MAX_IMPORT_ROWS}.` }],
      warnings,
    }
  }

  const indexOf = (key: string) => headers.indexOf(key)
  const submissions: StoredSubmission[] = []
  const ids = new Set<string>()

  body.forEach((line, offset) => {
    const rowNumber = offset + 2
    const values = parseCsvLine(line).map((value) => value.trim())
    const read = (key: string) => {
      const index = indexOf(key)
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

  return { submissions, errors, warnings }
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
