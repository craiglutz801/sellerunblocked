import { ROLE_QUESTIONS } from '@/lib/landing/demo-data'

export default function WhoItsForV2() {
  return (
    <section id="who-its-for" className="landing-section bg-su-ink text-white">
      <div className="landing-container">
        <div className="max-w-[40rem]">
          <p className="landing-eyebrow landing-eyebrow-dark">Who it’s for</p>
          <h2 className="landing-h2 mt-4">Questions each leader can finally ask.</h2>
        </div>
        <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {ROLE_QUESTIONS.map((item) => (
            <li key={item.role} className="grid gap-3 py-6 md:grid-cols-[14rem_1fr] md:items-baseline md:gap-10 md:py-7">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-su-blueBright">{item.role}</h3>
              <p className="text-xl leading-snug tracking-tight text-white sm:text-2xl">{item.question}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
