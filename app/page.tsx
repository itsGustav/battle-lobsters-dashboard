import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="text-8xl mb-6">🦞</div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
          Battle Lobsters
        </h1>
        
        <p className="text-xl text-slate-400 mb-8">
          Gear up. Dive deep. Dominate the depths.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="btn-primary text-lg px-8 py-3">
            Sign In
          </Link>
          <Link href="/signup" className="btn-secondary text-lg px-8 py-3">
            Create Account
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-16 text-left">
          <div className="card">
            <div className="text-3xl mb-3">⚔️</div>
            <h3 className="font-semibold mb-2">600+ Items</h3>
            <p className="text-sm text-slate-400">
              Collect gear across 5 rarity tiers. Hunt the legendary 1of1s.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">15 Synergies</h3>
            <p className="text-sm text-slate-400">
              Build themed loadouts. Unlock powerful set bonuses.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-3">🌊</div>
            <h3 className="font-semibold mb-2">5 Zones</h3>
            <p className="text-sm text-slate-400">
              From Shallow Waters to the Void Depths. Each with unique loot.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
