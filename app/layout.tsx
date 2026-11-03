import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SellerUnblocked | AI Revenue Friction Intelligence',
  description:
    'SellerUnblocked uses UnblockedAI to continuously listen to your sales organization, uncover revenue friction across process, product, marketing, pricing, enablement and more, and tell leaders what to fix first.',
  keywords: [
    'revenue friction',
    'revenue organization intelligence',
    'sales operations intelligence',
    'seller experience',
    'RevOps',
    'sales enablement',
    'sales organization health',
    'AI sales operations',
    'GTM intelligence',
  ],
  openGraph: {
    title: 'SellerUnblocked | AI Revenue Friction Intelligence',
    description: 'Find what’s blocking revenue. Fix what matters first.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SellerUnblocked | AI Revenue Friction Intelligence',
    description: 'Find what’s blocking revenue. Fix what matters first.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen font-sans bg-paper text-warm-800">{children}</body>
    </html>
  )
}
