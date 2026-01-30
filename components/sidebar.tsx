'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  BookOpen, 
  Settings,
  Trophy,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Tables } from '@/lib/database.types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/loadouts', label: 'Loadouts', icon: Layers },
  { href: '/collection', label: 'Collection', icon: BookOpen },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  profile: Tables<'profiles'>
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-3xl">🦞</span>
          <span className="font-bold text-xl">Battle Lobsters</span>
        </Link>
      </div>

      {/* Profile summary */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-lg font-bold">
            {profile.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{profile.display_name || profile.username}</div>
            <div className="text-sm text-slate-400">Level {profile.level}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>XP</span>
            <span>{profile.xp} / {profile.xp_to_next_level}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(profile.xp / profile.xp_to_next_level) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Currency display */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400 text-sm">Gold</span>
          <span className="text-amber-400 font-medium">{profile.gold.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 text-sm">Pearls</span>
          <span className="text-pink-400 font-medium">{profile.pearls.toLocaleString()}</span>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
