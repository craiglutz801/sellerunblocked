import Link from 'next/link'

const LINKS = [
  { label: 'Product', href: '#solution' },
  { label: 'Enablement Kits', href: '#enablement-kits' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'ROI', href: '#roi' },
  { label: 'Book Overview', href: '#final-cta' },
]

export default function Footer() {
  return (
    <footer className="border-t border-warm-400/30 bg-cream py-12">
      <div className="container-max px-5 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href="/" className="text-lg font-semibold text-ink">
              SellerUnblocked
            </Link>
            <p className="mt-2 text-sm text-warm-500">Revenue Organization Intelligence</p>
            <p className="mt-1 text-xs text-warm-400">
              Leadership intelligence. Seller enablement. One closed-loop system.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-warm-600">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-ink transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
