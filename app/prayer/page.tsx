import { HandMetal } from 'lucide-react'

export default function PrayerPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-[#01003b] mb-1">Prayer Requests</h1>
      <p className="text-[#a4a4a4] text-sm mb-8">Share what&apos;s on your heart. Your community is here.</p>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <HandMetal size={24} color="#a4a4a4" />
        </div>
        <p className="text-[#01003b] font-semibold">Prayer Board Coming Soon</p>
        <p className="text-xs text-[#a4a4a4]">Submit and support community prayer requests, launching in Phase 05.</p>
      </div>
    </div>
  )
}
