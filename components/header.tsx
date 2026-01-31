'use client'

import { Bell, Search, Gamepad2 } from 'lucide-react'
import type { Tables } from '@/lib/database.types'

interface HeaderProps {
  profile: Tables<'profiles'>
}

export function Header({ profile }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search items, loadouts..."
          className="input w-full pl-10 py-2"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Play button */}
        <button
          onClick={() => alert('Game coming soon! 🦞')}
          className="btn-primary flex items-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" />
          Play Now
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile quick view */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right">
            <div className="font-medium text-sm">{profile.display_name || profile.username}</div>
            <div className="text-xs text-slate-400">Level {profile.level}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold">
            {profile.username[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
