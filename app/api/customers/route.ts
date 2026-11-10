import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CustomerDataError } from '@/lib/customers/access'
import { MAX_IMPORT_BYTES } from '@/lib/customers/schema'
import { createCustomer, customerRoot, importCsv, operatorUser } from '@/lib/customers/store'
import type { ImportMode } from '@/lib/customers/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function remember(slug: string) {
  cookies().set('su-customer', slug, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
  })
}

function failure(error: unknown) {
  const code = (error as NodeJS.ErrnoException).code
  if (code === 'EROFS' || code === 'EACCES' || code === 'EPERM') {
    return NextResponse.json(
      {
        ok: false,
        errors: [
          {
            message:
              'This server cannot save customer files. Add the customer on a writable copy, then commit data/customers so the next deploy keeps it.',
          },
        ],
      },
      { status: 500 },
    )
  }
  if (error instanceof CustomerDataError) {
    return NextResponse.json({ ok: false, errors: error.errors }, { status: error.status })
  }
  console.error(error)
  return NextResponse.json({ ok: false, errors: [{ message: 'The customer could not be saved.' }] }, { status: 500 })
}

async function csvFrom(form: FormData): Promise<{ csv: string; name: string } | null> {
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) return null
  if (file.size > MAX_IMPORT_BYTES) {
    throw new CustomerDataError(`CSV is larger than ${MAX_IMPORT_BYTES} bytes.`)
  }
  return { csv: await file.text(), name: file.name || 'upload.csv' }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const action = String(form.get('action') ?? 'create')
    const root = customerRoot()
    const actor = operatorUser(root)
    const uploaded = await csvFrom(form)

    if (action === 'import') {
      const slug = String(form.get('slug') ?? '')
      const mode = String(form.get('mode') ?? 'replace')
      if (mode !== 'replace' && mode !== 'append') throw new CustomerDataError('Choose replace or append.')
      if (!uploaded) throw new CustomerDataError('Choose a CSV file to publish.')
      const result = importCsv(root, actor, {
        slug,
        csv: uploaded.csv,
        mode: mode as ImportMode,
        sourceName: uploaded.name,
      })
      remember(result.organization.slug)
      return NextResponse.json({
        ok: true,
        slug: result.organization.slug,
        name: result.organization.name,
        revisionId: result.revisionId,
        submissionCount: result.submissionCount,
        idempotent: result.idempotent,
        warnings: result.warnings,
      })
    }

    const result = createCustomer(root, actor, {
      name: String(form.get('name') ?? ''),
      industry: String(form.get('industry') ?? ''),
      region: String(form.get('region') ?? ''),
      sellerCountBand: String(form.get('sellerCountBand') ?? ''),
      contactName: String(form.get('contactName') ?? ''),
      contactEmail: String(form.get('contactEmail') ?? ''),
      csv: uploaded?.csv ?? null,
      sourceName: uploaded?.name,
    })
    remember(result.organization.slug)
    return NextResponse.json({
      ok: true,
      slug: result.organization.slug,
      name: result.organization.name,
      revisionId: result.revisionId,
      submissionCount: result.submissionCount,
      idempotent: result.idempotent,
      warnings: result.warnings,
    })
  } catch (error) {
    return failure(error)
  }
}
