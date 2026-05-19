import Link from 'next/link'
import { BookOpen, Heart, Dumbbell, HandMetal, Grid3x3, Users } from 'lucide-react'

const features = [
  { href: '/bible', icon: BookOpen, label: 'Bible', desc: 'Read scripture daily' },
  { href: '/devotionals', icon: Heart, label: 'Devotionals', desc: 'Daily & weekly faith' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts', desc: 'Train like a champion' },
  { href: '/prayer', icon: HandMetal, label: 'Prayer', desc: 'Submit & support prayers' },
  { href: '/resources', icon: Grid3x3, label: 'Resources', desc: 'Tools for your future' },
  { href: '/connect', icon: Users, label: 'Connect', desc: 'Find a tutor today' },
]

export default function HomePage() {
  return (
    <div className="px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#01003b] mb-2">Welcome to Gamebreakers</h1>
        <p className="text-lg text-[#a4a4a4] font-medium">Faith. Fitness. Future.</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-4">
        {features.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-start gap-3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-[#01003b] flex items-center justify-center">
              <Icon size={20} color="#ffffff" />
            </div>
            <div>
              <p className="font-semibold text-[#01003b] text-sm">{label}</p>
              <p className="text-xs text-[#a4a4a4] mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
