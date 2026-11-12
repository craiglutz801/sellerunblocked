import Link from 'next/link'

export default function EmptyWorkspace({ name }: { name: string }) {
  return (
    <section className="app-card p-8 md:p-10">
      <p className="app-eyebrow text-warm-500">No published data</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{name} has no published responses yet.</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-warm-600">
        This workspace does not borrow DemoTech scores, themes, or benchmarks. Upload the seller baseline CSV to publish
        the first wave.
      </p>
      <Link
        href="/app/settings"
        className="mt-6 inline-flex items-center rounded-full bg-accent-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink transition-colors"
      >
        Add responses
      </Link>
    </section>
  )
}
