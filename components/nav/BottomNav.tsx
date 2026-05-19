'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Heart, Dumbbell, HandMetal, Grid3x3 } from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/bible', icon: BookOpen, label: 'Bible' },
  { href: '/devotionals', icon: Heart, label: 'Devos' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/prayer', icon: HandMetal, label: 'Prayer' },
  { href: '/resources', icon: Grid3x3, label: 'Resources' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#01003b] border-t border-white/10 flex items-center">
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
          >
            <Icon
              size={20}
              color={active ? '#ffffff' : '#a4a4a4'}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? '#ffffff' : '#a4a4a4' }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
