export default function SectionIntro({
  eyebrow,
  title,
  children,
  align = 'left',
  tone = 'light',
  titleId,
}: {
  eyebrow?: string
  title: string
  children?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  titleId?: string
}) {
  const eyebrowClass = tone === 'dark' ? 'landing-eyebrow landing-eyebrow-dark' : 'landing-eyebrow'
  const titleClass = tone === 'dark' ? 'text-white' : 'text-su-text'
  const bodyClass = tone === 'dark' ? 'text-white/70' : 'text-su-secondary'
  return (
    <div className={align === 'center' ? 'mx-auto max-w-[44rem] text-center' : 'max-w-[44rem]'}>
      {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
      <h2 id={titleId} className={`landing-h2 mt-4 ${titleClass}`}>
        {title}
      </h2>
      {children ? <div className={`landing-body-lg mt-5 ${bodyClass}`}>{children}</div> : null}
    </div>
  )
}
