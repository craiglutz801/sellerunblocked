import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SellerUnblocked — Revenue Organization Intelligence & Seller Enablement Kits',
  description:
    'SellerUnblocked helps revenue leaders diagnose sales org friction and turn seller feedback into personalized enablement kits for every rep.',
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
