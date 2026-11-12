import type { Metadata } from 'next'
import Link from 'next/link'
import SectionHeader from '@/components/app/SectionHeader'
import ReadoutView from '@/components/app/unblocked-ai/ReadoutView'
import { loadReadout } from '@/lib/unblocked-ai/readout'

export const metadata: Metadata = {
  title: 'UnblockedAI',
}

export const dynamic = 'force-dynamic'

export default function UnblockedAiPage() {
  const model = loadReadout()
  if (!model.published) {
    return (
      <section className="app-card p-8 md:p-10">
        <p className="app-eyebrow">UnblockedAI</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Publish a wave to use UnblockedAI.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-warm-600">
          {model.canPublish
            ? `${model.organizationName} needs a published wave before UnblockedAI can rank what to fix.`
            : `${model.organizationName} needs a published wave. An admin publishes it from Settings.`}
        </p>
        {model.canPublish ? (
          <Link href="/app/settings" className="mt-6 inline-flex rounded-full bg-accent-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink">
            Open Settings
          </Link>
        ) : null}
      </section>
    )
  }

  return (
    <>
      <SectionHeader
        eyebrow="UnblockedAI"
        title="What your sellers are telling you and what to fix first."
        description={`${model.organizationName} · ${model.period} · ${model.responseCount} response${model.responseCount === 1 ? '' : 's'}${
          model.isDemo ? ' · DemoTech · Demo data' : ''
        }`}
      />
      <ReadoutView model={model} />
    </>
  )
}
