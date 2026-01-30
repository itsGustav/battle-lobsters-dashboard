'use client'

import { useState } from 'react'
import { Star, Lock, Check } from 'lucide-react'
import type { Tables } from '@/lib/database.types'

interface InventoryGridProps {
  items: Tables<'inventory_items'>[]
}

const gradeStyles = {
  general: 'border-gray-500 bg-gray-500/10',
  rare: 'border-blue-500 bg-blue-500/10',
  epic: 'border-purple-500 bg-purple-500/10',
  legendary: 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20',
  one_of_one: 'border-pink-500 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse',
}

const gradeLabels = {
  general: 'General',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  one_of_one: '1of1',
}

// Format item ID to display name
function formatItemName(id: string): string {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function InventoryGrid({ items }: InventoryGridProps) {
  const [selectedItem, setSelectedItem] = useState<Tables<'inventory_items'> | null>(null)

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-slate-400">Your inventory is empty</p>
        <p className="text-slate-500 text-sm mt-2">Play the game to collect items!</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Grid */}
      <div className="flex-1 grid grid-cols-6 gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`
              relative aspect-square rounded-lg border-2 p-2 transition-all hover:scale-105
              ${gradeStyles[item.grade as keyof typeof gradeStyles]}
              ${selectedItem?.id === item.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''}
            `}
          >
            {/* Item icon placeholder */}
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🦞
            </div>

            {/* Equipped indicator */}
            {item.is_equipped && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Favorite indicator */}
            {item.is_favorite && (
              <div className="absolute top-1 left-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
            )}

            {/* Locked indicator */}
            {item.is_locked && (
              <div className="absolute bottom-1 left-1">
                <Lock className="w-3 h-3 text-slate-400" />
              </div>
            )}

            {/* Stat multiplier */}
            <div className="absolute bottom-1 right-1 text-xs font-bold opacity-75">
              x{item.stat_multiplier.toFixed(2)}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="w-80 card sticky top-6 h-fit">
          <div className="text-center mb-4">
            <div className={`
              w-24 h-24 mx-auto rounded-xl border-2 flex items-center justify-center text-5xl mb-3
              ${gradeStyles[selectedItem.grade as keyof typeof gradeStyles]}
            `}>
              🦞
            </div>
            <h3 className="text-xl font-bold">{formatItemName(selectedItem.item_id)}</h3>
            <span className={`
              text-sm px-2 py-0.5 rounded
              ${selectedItem.grade === 'general' ? 'text-gray-400 bg-gray-500/20' : ''}
              ${selectedItem.grade === 'rare' ? 'text-blue-400 bg-blue-500/20' : ''}
              ${selectedItem.grade === 'epic' ? 'text-purple-400 bg-purple-500/20' : ''}
              ${selectedItem.grade === 'legendary' ? 'text-amber-400 bg-amber-500/20' : ''}
              ${selectedItem.grade === 'one_of_one' ? 'text-pink-400 bg-pink-500/20' : ''}
            `}>
              {gradeLabels[selectedItem.grade as keyof typeof gradeLabels]}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Slot</span>
              <span className="capitalize">{selectedItem.slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stat Multiplier</span>
              <span className="text-green-400">x{selectedItem.stat_multiplier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Acquired</span>
              <span>{new Date(selectedItem.acquired_at).toLocaleDateString()}</span>
            </div>
            {selectedItem.acquired_from && (
              <div className="flex justify-between">
                <span className="text-slate-400">Source</span>
                <span className="capitalize">{selectedItem.acquired_from.replace(':', ' → ')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button className="btn-primary flex-1">
              {selectedItem.is_equipped ? 'Unequip' : 'Equip'}
            </button>
            <button className="btn-secondary p-2">
              <Star className={`w-5 h-5 ${selectedItem.is_favorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <button className="btn-secondary p-2">
              <Lock className={`w-5 h-5 ${selectedItem.is_locked ? 'text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
