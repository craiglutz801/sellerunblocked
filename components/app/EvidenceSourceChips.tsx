import type { EvidenceSource } from '@/lib/types/platform'

const KIND_CLASS: Record<EvidenceSource['kind'], string> = {
  system: 'border-warm-400/30 bg-cream/60 text-warm-700',
  seller: 'border-accent/30 bg-accent-soft/50 text-accent-dark',
  question: 'border-violet-300/50 bg-violet-50 text-violet-800',
}

export default function EvidenceSourceChips({
  sources,
  showDetail = false,
}: {
  sources: EvidenceSource[]
  showDetail?: boolean
}) {
  return (
    <ul className={showDetail ? 'space-y-2' : 'flex flex-wrap gap-2'}>
      {sources.map((source) => (
        <li
          key={`${source.kind}-${source.label}`}
          className={
            showDetail
              ? `rounded-xl border px-3 py-2 ${KIND_CLASS[source.kind]}`
              : `rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium ${KIND_CLASS[source.kind]}`
          }
        >
          {showDetail ? (
            <>
              <p className="text-[0.625rem] font-bold uppercase tracking-wider">{source.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{source.detail}</p>
            </>
          ) : (
            source.label
          )}
        </li>
      ))}
    </ul>
  )
}
