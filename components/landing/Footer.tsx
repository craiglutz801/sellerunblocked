import Link from 'next/link'
import BookDemoButton from '@/components/landing/ui/BookDemoButton'
import UnblockedMark from '@/components/landing/ui/UnblockedMark'

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'UnblockedAI', href: '#unblocked-ai' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'Ask UnblockedAI', href: '#ask-unblocked-ai' },
]

export default function Footer() {
  return (
    <footer className="border-t border-su-text/10 bg-su-cream">
      <div className="landing-container flex flex-col gap-10 px-5 py-14 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <Link href="/" className="text-lg font-semibold tracking-tight text-su-ink">
              SellerUnblocked
            </Link>
            <p className="mt-2 text-sm text-su-secondary">
              powered by <UnblockedMark />
            </p>
            <p className="mt-4 text-sm leading-relaxed text-su-secondary">
              AI revenue friction intelligence for the operating reality around your sellers.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-su-secondary" aria-label="Footer">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="landing-focus-ring hover:text-su-ink">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-su-text/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-su-muted">© {new Date().getFullYear()} SellerUnblocked</p>
          <BookDemoButton variant="secondary">Book a demo</BookDemoButton>
        </div>
      </div>
    </footer>
  )
}
