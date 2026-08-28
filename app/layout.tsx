import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Seller Unblocked — AI-Powered Seller Optimization Platform',
  description:
    'Seller Unblocked finds what prevents sellers from selling, fixes what it can, and shows leadership what needs to change — with private enablement kits for every rep.',
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
