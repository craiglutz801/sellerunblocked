import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CustomerDataError } from '@/lib/customers/access'
import { buildReport } from '@/lib/customers/report'
import { customerRoot, operatorUser } from '@/lib/customers/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: string }
    const slug = body.slug?.trim() ?? ''
    const root = customerRoot()
    const report = buildReport({ root, user: operatorUser(root), slug, strict: true })
    cookies().set('su-customer', report.slug, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === 'production',
    })
    return NextResponse.json({ ok: true, slug: report.slug, name: report.organizationName })
  } catch (error) {
    if (error instanceof CustomerDataError) {
      return NextResponse.json({ ok: false, errors: error.errors }, { status: error.status })
    }
    console.error(error)
    return NextResponse.json({ ok: false, errors: [{ message: 'The workspace could not be switched.' }] }, { status: 500 })
  }
}
