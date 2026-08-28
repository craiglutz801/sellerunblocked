const ITEMS = [
  'Built for CROs, sales leadership, operations, and enablement',
  'Designed for 100+ seller organizations',
  'Aggregated intelligence for leadership',
  'Private enablement for individual sellers',
]

export default function TrustFitStrip() {
  return (
    <section className="border-y border-warm-400/20 bg-cream/80">
      <div className="container-wide py-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {ITEMS.map((item, i) => (
            <li
              key={item}
              className={`text-center text-sm font-medium text-warm-600 px-2 ${
                i > 0 ? 'sm:border-l sm:border-warm-400/25 lg:border-l' : ''
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
