'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { DEMO_REQUEST_EMAIL } from '@/lib/landing/demo-data'

type Variant = 'primary' | 'secondary' | 'ghost'
type Tone = 'light' | 'dark'

const VARIANT_CLASS: Record<string, string> = {
  'primary-light':
    'bg-su-blue text-su-ink hover:bg-su-blueBright shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
  'primary-dark':
    'bg-su-blue text-su-ink hover:bg-su-blueBright shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
  'secondary-light': 'border border-su-text/15 bg-white text-su-text hover:border-su-text/30',
  'secondary-dark': 'border border-white/20 bg-transparent text-white hover:bg-white/10',
  'ghost-light': 'text-su-secondary hover:text-su-text px-0',
  'ghost-dark': 'text-white/80 hover:text-white px-0',
}

export default function BookDemoButton({
  children,
  variant = 'primary',
  tone = 'light',
  className = '',
}: {
  children: React.ReactNode
  variant?: Variant
  tone?: Tone
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`landing-focus-ring inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold motion-safe:transition-colors motion-safe:duration-200 ${VARIANT_CLASS[`${variant}-${tone}`]} ${className}`}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open ? <DemoDialog onClose={() => { setOpen(false); triggerRef.current?.focus() }} /> : null}
    </>
  )
}

function DemoDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId()
  const descId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstField = useRef<HTMLInputElement>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    firstField.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const nodes = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = originalOverflow
      previous?.focus()
    }
  }, [onClose])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')
    const company = String(data.get('company') || '')
    const role = String(data.get('role') || '')
    const body = [
      `Name: ${name}`,
      `Work email: ${email}`,
      `Company: ${company}`,
      `Role: ${role || 'Not specified'}`,
      '',
      'I would like a SellerUnblocked demo.',
    ].join('\n')
    const href = `mailto:${DEMO_REQUEST_EMAIL}?subject=${encodeURIComponent('SellerUnblocked demo request')}&body=${encodeURIComponent(body)}`
    setSent(true)
    window.location.href = href
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" aria-label="Close demo request" className="absolute inset-0 bg-su-ink/70" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-su-paper p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="landing-eyebrow">Book a demo</p>
            <h2 id={titleId} className="landing-h3 mt-3 text-su-text">
              See what your sales organization is trying to tell you.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="landing-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-su-text/10 text-su-text"
            aria-label="Close"
          >
            <span aria-hidden className="text-lg leading-none">×</span>
          </button>
        </div>
        <p id={descId} className="mt-3 text-sm leading-relaxed text-su-secondary">
          Tell us who you are. Submitting opens an email draft to {DEMO_REQUEST_EMAIL}. Nothing is stored on this site.
        </p>
        <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
          <Field label="Name" name="name" required autoComplete="name" inputRef={firstField} />
          <Field label="Work email" name="email" type="email" required autoComplete="email" />
          <Field label="Company" name="company" required autoComplete="organization" />
          <label className="grid gap-1.5 text-sm font-medium text-su-text">
            Role
            <select
              name="role"
              className="landing-focus-ring min-h-11 rounded-xl border border-su-text/10 bg-white px-3 text-sm font-normal text-su-text"
              defaultValue="CRO / Revenue"
            >
              <option>CRO / Revenue</option>
              <option>RevOps</option>
              <option>Sales Operations</option>
              <option>Enablement</option>
              <option>Product / Product Marketing</option>
              <option>GTM leadership</option>
              <option>Other</option>
            </select>
          </label>
          <button
            type="submit"
            className="landing-focus-ring mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-su-ink text-sm font-semibold text-white hover:bg-su-ink2"
          >
            {sent ? 'Email draft opened' : 'Email a demo request'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  inputRef,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  inputRef?: React.Ref<HTMLInputElement>
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-su-text">
      {label}
      <input
        ref={inputRef}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="landing-focus-ring min-h-11 rounded-xl border border-su-text/10 bg-white px-3 text-sm font-normal text-su-text"
      />
    </label>
  )
}
