import type { Metadata } from 'next'
import './globals.css'
import TopBar from '@/components/nav/TopBar'
import BottomNav from '@/components/nav/BottomNav'

export const metadata: Metadata = {
  title: 'Gamebreakers App',
  description: 'Faith. Fitness. Future. — Game Breakers Academy',
  manifest: '/manifest.json',
  themeColor: '#01003b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <main className="pt-14 pb-16 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
