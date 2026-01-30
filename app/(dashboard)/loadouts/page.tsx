import { createClient } from '@/lib/supabase/server'
import { LoadoutCard } from '@/components/loadout-card'
import { Plus } from 'lucide-react'

export default async function LoadoutsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch loadouts with equipped items
  const { data: loadouts } = await supabase
    .from('loadouts')
    .select(`
      *,
      head_item:head_item_id(*),
      antennae_item:antennae_item_id(*),
      claw_left_item:claw_left_item_id(*),
      claw_right_item:claw_right_item_id(*),
      thorax_item:thorax_item_id(*),
      legs_item:legs_item_id(*),
      abdomen_item:abdomen_item_id(*),
      tail_item:tail_item_id(*),
      cosmetic_item:cosmetic_item_id(*)
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Loadouts</h1>
          <p className="text-slate-400">
            Manage your builds and equipment sets
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Loadout
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {loadouts?.map((loadout) => (
          <LoadoutCard key={loadout.id} loadout={loadout} />
        ))}
      </div>

      {(!loadouts || loadouts.length === 0) && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🦞</div>
          <p className="text-slate-400 mb-4">No loadouts yet</p>
          <button className="btn-primary">Create Your First Loadout</button>
        </div>
      )}
    </div>
  )
}
