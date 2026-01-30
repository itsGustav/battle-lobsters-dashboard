import { createClient } from '@/lib/supabase/server'
import { 
  Swords, Trophy, Clock, Coins, 
  TrendingUp, Target, Package, Star 
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  // Fetch inventory stats
  const { count: totalItems } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { data: gradeBreakdown } = await supabase
    .from('inventory_items')
    .select('grade')
    .eq('user_id', user!.id)

  // Count grades
  const gradeCounts = {
    general: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    one_of_one: 0,
  }
  gradeBreakdown?.forEach(item => {
    gradeCounts[item.grade as keyof typeof gradeCounts]++
  })

  // Fetch recent sessions
  const { data: recentSessions } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('user_id', user!.id)
    .order('started_at', { ascending: false })
    .limit(5)

  // Format play time
  const hours = Math.floor((profile?.total_play_time_seconds || 0) / 3600)
  const minutes = Math.floor(((profile?.total_play_time_seconds || 0) % 3600) / 60)
  const playTime = `${hours}h ${minutes}m`

  // XP progress percentage
  const xpProgress = ((profile?.xp || 0) / (profile?.xp_to_next_level || 100)) * 100

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.display_name || profile?.username}
        </h1>
        <p className="text-slate-400">Here's your Battle Lobsters overview</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Level</p>
            <p className="text-2xl font-bold">{profile?.level}</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Gold</p>
            <p className="text-2xl font-bold">{profile?.gold?.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-pink-500/20 rounded-lg">
            <Star className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Pearls</p>
            <p className="text-2xl font-bold">{profile?.pearls?.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Play Time</p>
            <p className="text-2xl font-bold">{playTime}</p>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">Level {profile?.level} Progress</span>
          <span className="text-sm text-slate-400">{profile?.xp} / {profile?.xp_to_next_level} XP</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Combat stats */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5" /> Combat Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Enemies Defeated</span>
              <span className="font-medium">{profile?.enemies_defeated?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bosses Defeated</span>
              <span className="font-medium">{profile?.bosses_defeated?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Highest Zone</span>
              <span className="font-medium capitalize">{profile?.highest_zone_reached}</span>
            </div>
          </div>
        </div>

        {/* Inventory overview */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" /> Inventory
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-grade-general border border-gray-600 rounded px-2 py-1 text-center">
                <div className="text-lg font-bold text-gray-400">{gradeCounts.general}</div>
                <div className="text-xs text-gray-500">General</div>
              </div>
              <div className="flex-1 bg-grade-rare border border-blue-600 rounded px-2 py-1 text-center">
                <div className="text-lg font-bold text-blue-400">{gradeCounts.rare}</div>
                <div className="text-xs text-blue-500">Rare</div>
              </div>
              <div className="flex-1 bg-grade-epic border border-purple-600 rounded px-2 py-1 text-center">
                <div className="text-lg font-bold text-purple-400">{gradeCounts.epic}</div>
                <div className="text-xs text-purple-500">Epic</div>
              </div>
              <div className="flex-1 bg-grade-legendary border border-amber-600 rounded px-2 py-1 text-center">
                <div className="text-lg font-bold text-amber-400">{gradeCounts.legendary}</div>
                <div className="text-xs text-amber-500">Legendary</div>
              </div>
              <div className="flex-1 bg-grade-1of1 border border-pink-600 rounded px-2 py-1 text-center">
                <div className="text-lg font-bold text-pink-400">{gradeCounts.one_of_one}</div>
                <div className="text-xs text-pink-500">1of1</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" /> Recent Sessions
        </h2>
        {recentSessions && recentSessions.length > 0 ? (
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div 
                key={session.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div>
                  <span className="font-medium capitalize">{session.zone || 'Unknown'}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    {new Date(session.started_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="text-slate-400">
                    <span className="text-slate-100">{session.enemies_defeated}</span> kills
                  </span>
                  <span className="text-slate-400">
                    <span className="text-amber-400">{session.gold_earned}</span> gold
                  </span>
                  <span className="text-slate-400">
                    <span className="text-blue-400">{session.xp_earned}</span> XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">
            No sessions yet. Start playing to track your progress!
          </p>
        )}
      </div>
    </div>
  )
}
