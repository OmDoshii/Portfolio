import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your Name — Freelance SaaS & Web Developer',
  description: 'I build fast, scalable SaaS platforms, web apps, and websites. Based in India, working with clients worldwide.',
  keywords: ['freelance developer India', 'SaaS developer', 'Next.js developer', 'web app development'],
  openGraph: {
    title: 'Your Name — Freelance SaaS & Web Developer',
    description: 'I build fast, scalable SaaS platforms and websites.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise">{children}</body>
    </html>
  )
}
