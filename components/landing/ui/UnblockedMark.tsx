export default function UnblockedMark({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const base = tone === 'light' ? 'text-white' : 'text-su-ink'
  const ai = tone === 'light' ? 'text-su-blueBright' : 'text-su-blueText'
  return (
    <span className={`font-semibold tracking-tight ${base}`}>
      Unblocked<span className={ai}>AI</span>
    </span>
  )
}
