'use client'

import type { Tables } from '@/lib/database.types'

interface CollectionGridProps {
  slot: string
  items: Tables<'collection'>[]
  totalItems: number
}

const gradeOrder = ['general', 'rare', 'epic', 'legendary', 'one_of_one'] as const

export function CollectionGrid({ slot, items, totalItems }: CollectionGridProps) {
  // Create placeholder array for undiscovered items
  const discoveredIds = new Set(items.map(i => i.item_id))
  
  return (
    <div className="grid grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.item_id} className="space-y-1">
          <div className="text-sm font-medium truncate capitalize">
            {item.item_id.replace(/_/g, ' ')}
          </div>
          <div className="text-xs text-slate-400">
            {item.times_acquired}× acquired
          </div>
          {/* Grade discovery dots */}
          <div className="flex gap-1">
            {gradeOrder.map((grade) => {
              const key = `${grade}_discovered` as keyof typeof item
              const discovered = item[key] as boolean
              return (
                <div
                  key={grade}
                  className={`w-4 h-4 rounded-full border-2 ${
                    discovered
                      ? grade === 'general' ? 'bg-gray-400 border-gray-400' :
                        grade === 'rare' ? 'bg-blue-400 border-blue-400' :
                        grade === 'epic' ? 'bg-purple-400 border-purple-400' :
                        grade === 'legendary' ? 'bg-amber-400 border-amber-400' :
                        'bg-pink-400 border-pink-400'
                      : 'border-slate-600 bg-transparent'
                  }`}
                  title={`${grade}${discovered ? ' ✓' : ''}`}
                />
              )
            })}
          </div>
        </div>
      ))}
      
      {/* Placeholder for undiscovered */}
      {Array.from({ length: totalItems - items.length }).map((_, i) => (
        <div key={`unknown-${i}`} className="space-y-1 opacity-30">
          <div className="text-sm font-medium">???</div>
          <div className="text-xs text-slate-600">Not discovered</div>
          <div className="flex gap-1">
            {gradeOrder.map((grade) => (
              <div
                key={grade}
                className="w-4 h-4 rounded-full border-2 border-slate-700 bg-transparent"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
