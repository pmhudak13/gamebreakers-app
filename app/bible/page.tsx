import { BookOpen } from 'lucide-react'

export default function BiblePage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-[#01003b] mb-1">Bible</h1>
      <p className="text-[#a4a4a4] text-sm mb-8">Read scripture, search verses, and get your daily word.</p>

      <div className="bg-[#01003b] rounded-2xl p-6 text-white text-center mb-6">
        <p className="text-xs uppercase tracking-widest text-[#a4a4a4] mb-2">Verse of the Day</p>
        <p className="text-base font-medium leading-relaxed">&ldquo;I can do all things through Christ who strengthens me.&rdquo;</p>
        <p className="text-xs text-[#a4a4a4] mt-2">Philippians 4:13</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <BookOpen size={24} color="#a4a4a4" />
        </div>
        <p className="text-[#01003b] font-semibold">Bible Reader Coming Soon</p>
        <p className="text-xs text-[#a4a4a4]">Full scripture search and reading experience launching in Phase 03.</p>
      </div>
    </div>
  )
}
