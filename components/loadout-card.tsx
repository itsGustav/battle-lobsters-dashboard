'use client'

import { Check, Edit2, Trash2, Zap } from 'lucide-react'

interface LoadoutItem {
  id: string
  item_id: string
  grade: string
  stat_multiplier: number
}

interface Loadout {
  id: string
  name: string
  is_active: boolean
  synergy_theme: string | null
  synergy_count: number
  synergy_power: number
  head_item: LoadoutItem | null
  antennae_item: LoadoutItem | null
  claw_left_item: LoadoutItem | null
  claw_right_item: LoadoutItem | null
  thorax_item: LoadoutItem | null
  legs_item: LoadoutItem | null
  abdomen_item: LoadoutItem | null
  tail_item: LoadoutItem | null
  cosmetic_item: LoadoutItem | null
}

interface LoadoutCardProps {
  loadout: Loadout
}

const slots = [
  { key: 'head_item', label: 'Head' },
  { key: 'antennae_item', label: 'Antennae' },
  { key: 'claw_left_item', label: 'L Claw' },
  { key: 'claw_right_item', label: 'R Claw' },
  { key: 'thorax_item', label: 'Thorax' },
  { key: 'legs_item', label: 'Legs' },
  { key: 'abdomen_item', label: 'Abdomen' },
  { key: 'tail_item', label: 'Tail' },
  { key: 'cosmetic_item', label: 'Cosmetic' },
]

const gradeColors = {
  general: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500',
  one_of_one: 'bg-pink-500',
}

function formatItemName(id: string): string {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function LoadoutCard({ loadout }: LoadoutCardProps) {
  const equippedCount = slots.filter(s => loadout[s.key as keyof Loadout]).length

  return (
    <div className={`card relative ${loadout.is_active ? 'ring-2 ring-green-500' : ''}`}>
      {/* Active badge */}
      {loadout.is_active && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" />
          Active
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{loadout.name}</h3>
          <p className="text-sm text-slate-400">{equippedCount}/9 slots filled</p>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Synergy display */}
      {loadout.synergy_theme && loadout.synergy_count >= 2 && (
        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-medium capitalize">{loadout.synergy_theme} Synergy</span>
          </div>
          <div className="text-sm text-slate-400">
            {loadout.synergy_count}/8 pieces • {(loadout.synergy_power * 100).toFixed(0)}% power
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${loadout.synergy_power * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Equipment grid */}
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const item = loadout[slot.key as keyof Loadout] as LoadoutItem | null
          return (
            <div
              key={slot.key}
              className={`
                p-2 rounded-lg border text-center text-xs
                ${item 
                  ? `border-slate-700 bg-slate-800/50` 
                  : 'border-dashed border-slate-700 bg-slate-900/50'}
              `}
            >
              {item ? (
                <>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className={`w-2 h-2 rounded-full ${gradeColors[item.grade as keyof typeof gradeColors]}`} />
                    <span className="truncate">{formatItemName(item.item_id).split(' ')[0]}</span>
                  </div>
                  <span className="text-slate-500">x{item.stat_multiplier.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-slate-600">{slot.label}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {!loadout.is_active && (
          <button className="btn-primary flex-1">Set Active</button>
        )}
        <button className="btn-secondary flex-1">Edit Build</button>
      </div>
    </div>
  )
}
