import { createClient } from '@/lib/supabase/server'
import { CollectionGrid } from '@/components/collection-grid'
import type { Tables } from '@/lib/database.types'

// Item metadata (would come from item_schema.json in production)
const TOTAL_ITEMS_PER_SLOT = 15
const SLOTS = ['head', 'antennae', 'claws', 'thorax', 'legs', 'abdomen', 'tail', 'cosmetic']

export default async function CollectionPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch collection data
  const { data: collectionData } = await supabase
    .from('collection')
    .select('*')
    .eq('user_id', user!.id)

  const collection = collectionData as Tables<'collection'>[] | null

  // Calculate completion stats
  const totalPossible = SLOTS.length * TOTAL_ITEMS_PER_SLOT * 5 // 5 grades
  const discovered = collection?.reduce((acc, item) => {
    let count = 0
    if (item.general_discovered) count++
    if (item.rare_discovered) count++
    if (item.epic_discovered) count++
    if (item.legendary_discovered) count++
    if (item.one_of_one_discovered) count++
    return acc + count
  }, 0) || 0

  const completionPercent = ((discovered / totalPossible) * 100).toFixed(1)

  // Group by slot for display
  const collectionBySlot = SLOTS.reduce((acc, slot) => {
    acc[slot] = collection?.filter(c => c.slot === slot) || []
    return acc
  }, {} as Record<string, typeof collection>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Collection</h1>
          <p className="text-slate-400">
            Track every item you've discovered
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-400">{completionPercent}%</div>
          <div className="text-sm text-slate-400">
            {discovered} / {totalPossible} discovered
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Collection Progress</span>
          <span className="text-slate-400">{discovered} / {totalPossible}</span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Per-slot grids */}
      {SLOTS.map((slot) => (
        <div key={slot} className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">{slot}</h2>
            <span className="text-sm text-slate-400">
              {collectionBySlot[slot]?.length || 0} / {TOTAL_ITEMS_PER_SLOT} types
            </span>
          </div>
          <CollectionGrid 
            slot={slot} 
            items={collectionBySlot[slot] || []}
            totalItems={TOTAL_ITEMS_PER_SLOT}
          />
        </div>
      ))}
    </div>
  )
}
