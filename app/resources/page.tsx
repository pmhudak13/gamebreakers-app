import { Grid3x3 } from 'lucide-react'

export default function ResourcesPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-[#01003b] mb-1">Resources</h1>
      <p className="text-[#a4a4a4] text-sm mb-8">Curated tools, articles, and videos for your development.</p>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Grid3x3 size={24} color="#a4a4a4" />
        </div>
        <p className="text-[#01003b] font-semibold">Resources Hub Coming Soon</p>
        <p className="text-xs text-[#a4a4a4]">College prep, mental health, faith, and fitness resources launching in Phase 06.</p>
      </div>
    </div>
  )
}
