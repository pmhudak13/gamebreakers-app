'use client'

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#01003b] flex items-center px-4 shadow-md">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#01003b] text-xs font-black">GB</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Gamebreakers</span>
      </div>
    </header>
  )
}
